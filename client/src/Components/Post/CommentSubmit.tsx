import React, { useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import SendIcon from "@mui/icons-material/Send"
import { CommentCreationData, UserData } from "../../redux/api/type"
import { useDispatch, useSelector } from "react-redux"
import { addCommentAction } from "../../redux/actions/commentAction"

interface CommentSubmitData {
  parentID: string
  parentType: "post" | "comment"
}

function CommentSubmit({ parentId, parentType }) {
  const [content, setContent] = useState<string>()
  const userData: UserData = useSelector((state) => state.auth?.userData)

  const dispatch = useDispatch()

  const handleOnChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = () => async () => {
    console.log("envoie !")
    if (!content) {
      return
    }

    const commentData: CommentCreationData = {
      parentId: parentId,
      parentType: parentType,
      content: content,
      user: userData._id,
    }

    await dispatch<any>(addCommentAction(commentData))

    setContent("")
  }

  return (
    <div className="flex gap-4 items-center">
      <img
        src={profilePlaceholder}
        alt="profileImage"
        className="w-11 h-11 shrink-0 rounded-full"
      />
      <input
        className="appearance-none border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-2xl w-full py-2 px-4  text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
        type="text"
        placeholder={"Write your comment"}
        onChange={handleOnChange}
      />
      <button onClick={handleSubmit()}>
        <SendIcon className="text-gray-500 hover:text-gray-900" />
      </button>
    </div>
  )
}

export default CommentSubmit
