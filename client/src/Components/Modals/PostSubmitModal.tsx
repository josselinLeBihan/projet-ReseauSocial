import React, { useEffect, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import { CommunityData, UserFormatedData } from "../../redux/api/type"
import CloseIcon from "@mui/icons-material/Close"
import { UserData } from "../../App"
import useClickOutside from "../../hook/useClickOutside"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import SendIcon from "@mui/icons-material/Send"
import ConfirmationModal from "./ConfirmationModal"

interface PostSubmitModalProps {
  user: UserData
  community: CommunityData
  onClose: () => void
  onPostSubmit: (body: string) => Promise<void>
}

const PostSubmitModal: React.FC<PostSubmitModalProps> = ({
  user,
  community,
  onClose,
  onPostSubmit,
}) => {
  const [isConfirmQuitModalShow, setIsConfirmQuitModalShow] =
    useState<boolean>(false)
  const [isShowModal, setIsShowModal] = useState<boolean>(true)
  const [isButtonSubmitDisabled, setIsButtonSubmitDisabled] =
    useState<boolean>(true)
  const modalRef = useClickOutside(() => {
    checkBeforeClose()
  })
  const [body, setBody] = useState<string>("")

  const checkBeforeClose = () => {
    console.log(body)
    if (body.trim() !== "") {
      setIsConfirmQuitModalShow(true)
      return
    }
    setIsShowModal(false)
    onClose()
  }

  const handleSubmit = () => {
    if (body.trim() === "") return
    onPostSubmit(body)
    setIsShowModal(false)
    onClose()
  }

  useEffect(() => {
    if (body.trim() === "") {
      setIsButtonSubmitDisabled(true)
    } else {
      setIsButtonSubmitDisabled(false)
    }
  }, [body])

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex" />

      <div
        className="fixed w-full max-w-4xl z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ref={modalRef}
      >
        {isConfirmQuitModalShow && (
          <ConfirmationModal
            title="Confirmer la fermeture"
            message="Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?"
            onConfirm={() => {
              setIsConfirmQuitModalShow(false)
              setIsShowModal(false)
              onClose()
            }}
            onCancel={() => setIsConfirmQuitModalShow(false)}
            buttonCancelText="Annuler"
            buttonConfirmText="Confirmer"
          />
        )}
        <div className="flex flex-col rounded-2xl bg-white p-6 shadow gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <img
                src={profilePlaceholder}
                alt="profileImage"
                className="w-11 h-11 shrink-0 rounded-full"
              />
              <div className=" flex flex-col flex-1 truncate">
                <span className="truncate relative pr-8 font-medium text-gray-900">
                  {user?.userName}
                </span>
                <p className="font-normal text-sm leading-tight truncate text-zinc-500">
                  {`Communauté: ${community?.name}`}
                </p>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-gray-900"
              onClick={checkBeforeClose}
            >
              <CloseIcon />
            </button>
          </div>
          <textarea
            className="h-60 w-full appearance-none border-2 text-lg bg-gray-100 border-gray-100 hover:border-gray-400 transition-colors rounded-md p-4  text-gray-800 leading-tight focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:shadow-outline"
            placeholder="Ecrivez votre poste ici..."
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex w-full gap-4">
            <button className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2">
              <ImageIcon />
              Image
            </button>
            <button className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2">
              <VideocamIcon />
              Vidéo
            </button>
          </div>
          <div className="flex w-full justify-end border-t pt-6">
            <button
              className={
                isButtonSubmitDisabled
                  ? "bg-gray-200 text-gray-400 rounded-md flex items-center gap-2 px-4 py-2"
                  : "text-gray-200 bg-teal-600 text-base px-4 py-2 hover:bg-teal-500 rounded-md flex items-center gap-2 "
              }
              onClick={handleSubmit}
              disabled={isButtonSubmitDisabled}
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

export default PostSubmitModal
