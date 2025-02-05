import React, { memo, useEffect, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CommentIcon from "@mui/icons-material/Comment"
import Like from "./Like"
import CommentSubmit from "./CommentSubmit"
import Comment from "./Comment"
import { PostData, UserData } from "../../redux/api/type"
import { getUserAction } from "../../redux/actions/userActions"
import { useAppDispatch } from "../../redux/store"

interface PostParams {
  post: PostData
}

const MemoizedComment = memo(Comment)

const Post: React.FC<PostParams> = ({ post }) => {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [userData, setUser] = useState<UserData | null>(null)
  const { _id, content, fileUrl, fileType, user, createdAt, comments } = post

  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch(getUserAction(post.user))
      setUser(result?.data)
    }
    fetchUser()
  }, [dispatch, post.user])

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  //Réccupération des sous commentaire
  const LIMIT = 5

  const memoizedComments = useMemo(() => {
    return (comments ?? [])
      .slice(0, LIMIT)
      .map((childComment) => (
        <MemoizedComment key={childComment} id={childComment} />
      ))
  }, [comments])

  return (
    <div className="flex p-6 bg-gray-50 rounded-lg flex-col gap-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <img
            src={profilePlaceholder}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className=" flex flex-col flex-1 truncate">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              {userData?.name}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              {`@${userData?.userName}`}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-900">
          <MoreHorizIcon />
        </button>
      </div>
      <span>{content}</span>
      {fileUrl && <img src={fileUrl} />}
      <hr className=" border-0 border-t-2 border-gray-300" />
      <div className="flex gap-4">
        <Like />
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-gray-900 text-sm"
            onClick={handleCommentOnClick}
          >
            <CommentIcon />
          </button>
          <span>{comments?.length}</span>
        </div>
      </div>
      {showCommentSection && (
        <div className=" flex gap-6 flex-col">
          <CommentSubmit parentId={_id} parentType="post" />
          {memoizedComments}
        </div>
      )}
    </div>
  )
}

export default Post
