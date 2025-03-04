import React, { useEffect, useState, useMemo } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import { PhotoProvider, PhotoView } from "react-photo-view"
import {
  CommunityData,
  PostCreationData,
  UserFormatedData,
} from "../../redux/api/type"
import CloseIcon from "@mui/icons-material/Close"
import { UserData } from "../../App"
import useClickOutside from "../../hook/useClickOutside"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import SendIcon from "@mui/icons-material/Send"
import ConfirmationModal from "./ConfirmationModal"
import { logger } from "../../utils/logger"

interface PostSubmitModalProps {
  userName: UserData["userName"]
  community: CommunityData
  previousBody?: string
  onClose: () => void
  onPostSubmit: (
    body: string,
    fileUrl: string | null,
    fileType: string | null,
  ) => Promise<void>
}

const PostModal: React.FC<PostSubmitModalProps> = ({
  userName,
  community,
  onClose,
  onPostSubmit,
  previousBody = "",
}) => {
  const [isConfirmQuitModalVisible, setIsConfirmQuitModalVisible] =
    useState(false)
  const [body, setBody] = useState(previousBody)
  const [selectedFile, setSelectedFile] = useState<{
    url: string | null
    type: string | null
  }>({
    url: null,
    type: null,
  })

  const modalRef = useClickOutside(handleModalClose)

  const isSubmitDisabled = useMemo(() => body.trim() === "", [body])

  function handleModalClose() {
    if (body.trim() && body !== previousBody) {
      setIsConfirmQuitModalVisible(true)
      return
    }
    onClose()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    logger.info("Choix d'un fichier")
    const file = event.target.files?.[0]

    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      alert(
        "Le fichier choisi est trop volumineux, choisissez un fichier de moins de 50Mo",
      )
      return
    }

    const fileType = file.type
    const reader = new FileReader()

    reader.onload = (e) => {
      setSelectedFile({ url: e.target?.result as string, type: fileType })
    }

    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!body.trim()) return
    logger.debug(
      `Envoi du post: ${body}, fichier: ${selectedFile.url}, type: ${selectedFile.type}`,
    )
    await onPostSubmit(body, selectedFile.url, selectedFile.type)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex" />

      <div
        className="fixed w-full max-w-4xl z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ref={modalRef}
      >
        {isConfirmQuitModalVisible && (
          <ConfirmationModal
            title="Confirmer la fermeture"
            message="Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?"
            onConfirm={onClose}
            onCancel={() => setIsConfirmQuitModalVisible(false)}
            buttonCancelText="Annuler"
            buttonConfirmText="Confirmer"
          />
        )}

        <div className="flex flex-col rounded-2xl bg-white p-6 shadow gap-4">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <img
                src={profilePlaceholder}
                alt="profileImage"
                className="w-11 h-11 shrink-0 rounded-full"
              />
              <div className="flex flex-col flex-1 truncate">
                <span className="truncate relative pr-8 font-medium text-gray-900">
                  {userName}
                </span>
                <p className="font-normal text-sm text-zinc-500 truncate">
                  {`Communauté: ${community?.name}`}
                </p>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-gray-900"
              onClick={handleModalClose}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            className="h-60 w-full border-2 text-lg bg-gray-100 border-gray-100 hover:border-gray-400 transition-colors rounded-md p-4 text-gray-800 leading-tight focus:outline-none focus:ring-teal-600 focus:border-teal-600"
            placeholder="Écrivez votre post ici..."
            onChange={(e) => setBody(e.target.value)}
            value={body}
          />

          {/* File Preview */}
          {selectedFile.url ? (
            <div className="relative h-28 w-28">
              <button
                className="absolute top-2 right-2 bg-white/80 rounded-full hover:bg-white"
                onClick={() => setSelectedFile({ url: null, type: null })}
              >
                <CloseIcon style={{ fontSize: 24 }} />
              </button>
              <PhotoProvider>
                <PhotoView src={selectedFile.url}>
                  <img
                    src={selectedFile.url}
                    alt="Selected file preview"
                    className="rounded-md cursor-pointer object-cover h-full"
                  />
                </PhotoView>
              </PhotoProvider>
            </div>
          ) : (
            <div className="flex w-full gap-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="text-gray-800 px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon /> Image
              </label>
              <label
                htmlFor="file-input"
                className="text-gray-800 px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <VideocamIcon /> Vidéo
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex w-full justify-end border-t pt-6">
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                isSubmitDisabled
                  ? "bg-gray-200 text-gray-400"
                  : "bg-teal-600 text-white hover:bg-teal-500"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              <SendIcon />
              Poster
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostModal
