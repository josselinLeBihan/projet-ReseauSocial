import React, { useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import SendIcon from "@mui/icons-material/Send"
import { CommentCreationData, UserData } from "../../redux/api/type"
import { addCommentAction } from "../../redux/actions/commentAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"

interface CommentSubmitData {
  parentID: string
  parentType: "post" | "comment"
}

function CommentSubmit({ parentId, parentType }) {
  const [content, setContent] = useState<string>()
  const userData: UserData = useAppSelector((state) => state.auth?.userData)

  const dispatch = useAppDispatch()

  const handleOnChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = () => async () => {
    if (!content) {
      return
    }

    const commentData: CommentCreationData = {
      parentId: parentId,
      parentType: parentType,
      content: content,
      user: userData._id,
    }

    await dispatch(addCommentAction(commentData))

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
        className="h-fit appearance-none border-2 w-full bg-gray-100 border-gray-100 hover:border-gray-400 transition-colors rounded-full py-4 pl-10 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:shadow-outline"
        type="text"
        placeholder={"Ecrivez votre commentaire"}
        onChange={handleOnChange}
      />
      <button onClick={handleSubmit()} data-testid="send-button">
        <SendIcon className="text-gray-500 hover:text-gray-900" />
      </button>
    </div>
  )
}

export default CommentSubmit
