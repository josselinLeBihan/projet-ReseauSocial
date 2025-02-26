import React, { useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import { Button } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import SendIcon from "@mui/icons-material/Send"
import { CommunityData, PostCreationData, UserData } from "../../redux/api/type"
import { addPostAction } from "../../redux/actions/postAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { logger } from "../../utils/logger"
import PostSubmitModal from "../Modals/PostSubmitModal"
import useClickOutside from "../../hook/useClickOutside"

function PostSubmit() {
  const dispatch = useAppDispatch()
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const userData: UserData = useAppSelector((state) => state.auth?.userData)
  const commmunity: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  const handleSubmit = async (body: string) => {
    if (!userData) {
      logger.error("Userdata n'est pas définit", userData)
      return
    }

    if (!body.trim()) {
      logger.warn("Tentative d'envoi d'un post vide.")
      return
    }
    try {
      logger.info(`Création d'un post par ${userData.name}...`)
      const postData: PostCreationData = {
        content: body,
        user: userData._id,
        community: commmunity._id,
      }

      await dispatch(addPostAction(postData))

      logger.info(`Post créé avec succés`)
    } catch (error) {
      logger.error("Erreur lors de la création du Post :", error)
    }
  }

  return (
    <>
      {isShowModal && (
        <PostSubmitModal
          user={userData}
          community={commmunity}
          onClose={() => setIsShowModal(false)}
          onPostSubmit={handleSubmit}
        />
      )}
      <div className="flex-1 gap-4 flex p-6 bg-gray-50 rounded-2xl">
        <img
          src={profilePlaceholder}
          alt="profileImage"
          className="w-11 h-11 shrink-0 rounded-full"
        />
        <div className="flex flex-col flex-1 gap-4 ">
          <div
            className="h-fit appearance-none border-2  bg-gray-100 border-gray-100 hover:border-gray-400 transition-colors rounded-md py-4 pl-10 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:shadow-outline"
            onClick={() => setIsShowModal(true)}
          >
            <p className="text-gray-500">Ecrivez votre poste ici...</p>
          </div>
          <div className="flex gap-4 justify-between">
            <div className="flex ">
              <button className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2">
                <ImageIcon />
                Image
              </button>
              <button className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2">
                <VideocamIcon />
                <p>Vidéo</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostSubmit
