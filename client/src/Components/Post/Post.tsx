import React, { useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CommentIcon from "@mui/icons-material/Comment"
import Like from "./Like"
import WriteComments from "./WriteComments"
import Comments from "./Comments"

interface PostProps {
  post: {
    id: string
    userdata: any
    content: string
    fileUrl?: string
    fileType?: string
    user: string
    createdAt: string
    comments?: string[]
  }
}

function Post({ post }: PostProps) {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const {
    id,
    content,
    fileUrl,
    fileType,
    user,
    createdAt,
    comments,
    userdata,
  } = post
  console.log(post)

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  return (
    <div className="flex p-6 bg-gray-50 rounded-lg flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <img
            src={profilePlaceholder}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className=" flex flex-col flex-1 truncate">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              {user}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              @Jisso
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-900">
          <MoreHorizIcon />
        </button>
      </div>
      <span>{content}</span>
      {fileUrl && <img src={fileUrl} />}
      <div className="flex gap-4">
        <Like />
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-gray-900 text-sm"
            onClick={handleCommentOnClick}
          >
            <CommentIcon />
          </button>
          <span>2</span>
        </div>
      </div>
      {showCommentSection && (
        <>
          <WriteComments idPoste={id} userData={userdata} />
          <Comments id="parent_1" />
        </>
      )}
    </div>
  )
}

export default Post
