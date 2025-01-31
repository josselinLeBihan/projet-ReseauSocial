import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import { Button } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import VideocamIcon from "@mui/icons-material/Videocam"
import SendIcon from "@mui/icons-material/Send"
import { CommunityData, PostCreationData, UserData } from "../../redux/api/type"
import { addPostAction } from "../../redux/actions/postAction"

function PostSubmit() {
  const dispatch = useDispatch()
  const [body, setBody] = React.useState("")
  const userData: UserData = useSelector((state) => state.auth?.userData)
  const commmunity: CommunityData = useSelector(
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

  const handleSubmit = () => async () => {
    const postData: PostCreationData = {
      content: body,
      user: userData._id,
      community: commmunity._id,
    }

    await dispatch<any>(addPostAction(postData))

    setBody("")
  }

  return (
    <div className="flex-1 gap-4 flex ">
      <img
        src={profilePlaceholder}
        alt="profileImage"
        className="w-11 h-11 shrink-0 rounded-full"
      />
      <div className="flex flex-col flex-1 gap-4">
        <textarea
          className="h-fit appearance-none border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-4 pl-10 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
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
            onClick={handleSubmit()}
          >
            <SendIcon />
            <p>Envoyer</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostSubmit
