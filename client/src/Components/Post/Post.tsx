import React, { useEffect, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CommentIcon from "@mui/icons-material/Comment"
import Like from "./Like"
import CommentSubmit from "./CommentSubmit"
import Comments from "./Comments"
import { PostData, UserData } from "../../redux/api/type"
import { useDispatch } from "react-redux"
import { getUserAction } from "../../redux/actions/userActions"

interface PostParams {
  post: PostData
}

const Post: React.FC<PostParams> = ({ post }) => {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const { _id, content, fileUrl, fileType, userId, createdAt, comments } = post

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch<any>(getUserAction(post.userId))
      setUser(result.data)
    }
    fetchUser()
  }, [dispatch, post.userId])

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
              {user?.name}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              {user?.userName}
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
          <CommentSubmit idParent={_id} parentType="post" />
          <Comments id="parent_1" />
        </>
      )}
    </div>
  )
}

export default Post
