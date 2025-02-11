import React, { useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import { Button } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import SendIcon from "@mui/icons-material/Send"
import { CommunityData, PostCreationData, UserData } from "../../redux/api/type"
import { addPostAction } from "../../redux/actions/postAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import logger from "../../utils/logger"

function PostSubmit() {
  const dispatch = useAppDispatch()
  const [body, setBody] = React.useState("")
  const userData: UserData = useAppSelector((state) => state.auth?.userData)
  const commmunity: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )
  const [rows, setRows] = useState(1) // Nombre initial de lignes
  const maxRows = 5 // Nombre maximum de lignes

  const areaAdapter = (e) => {
    const textareaLineHeight = 24
    const previousRows = e.target.rows
    e.target.rows = 1

    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight)

    if (currentRows === previousRows) {
      e.target.rows = currentRows
    }

    if (currentRows >= maxRows) {
      e.target.rows = maxRows
      e.target.scrollTop = e.target.scrollHeight
    }

    setRows(currentRows < maxRows ? currentRows : maxRows)
  }

  const handleTextChange = (e) => {
    areaAdapter(e)
    setBody(e.target.value)
  }

  const handleSubmit = async () => {
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

      setBody("")
      logger.info(`Post créé avec succés`)
    } catch (error) {
      logger.error("Erreur lors de la création du Post :", error)
    }
  }

  return (
    <div className="flex-1 gap-4 flex p-6 bg-gray-50 rounded-2xl">
      <img
        src={profilePlaceholder}
        alt="profileImage"
        className="w-11 h-11 shrink-0 rounded-full"
      />
      <div className="flex flex-col flex-1 gap-4 ">
        <textarea
          className="h-fit appearance-none border-2 bg-gray-100 border-gray-100 hover:border-gray-400 transition-colors rounded-md py-4 pl-10 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:shadow-outline"
          placeholder="Ecrivez votre poste ici..."
          rows={1}
          onChange={handleTextChange}
        />
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
          <button
            className="text-gray-200 bg-teal-600 text-base px-2 py-2 hover:bg-teal-500 rounded-md flex items-center gap-2 "
            onClick={handleSubmit}
          >
            <SendIcon />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostSubmit
