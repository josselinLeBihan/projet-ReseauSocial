import React, { memo, useEffect, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CommentIcon from "@mui/icons-material/Comment"
import Like from "./Like"
import CommentSubmit from "./CommentSubmit"
import Comment from "./Comment"
import { PostDataformated, UserData } from "../../redux/api/type"
import { logger } from "../../utils/logger"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { useAppSelector } from "../../redux/store"

interface PostParams {
  post: PostDataformated
}

const LIMIT: number = 5

const MemoizedComment = memo(Comment)

const Post: React.FC<PostParams> = ({ post }) => {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [commentsLenght, setCommentsLenght] = useState<number>(LIMIT)
  const { _id, content, fileUrl, fileType, user, createdAt, comments } = post

  const actualUserUser: UserData = useAppSelector(
    (state) => state.auth?.userData,
  )

  const isUserPost: boolean = actualUserUser?.userName === user?.userName

  const totalComments = comments?.length || 0

  logger.debug(`Post ${_id} chargé avec succès.`)

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  const memoizedComments = useMemo(() => {
    return (comments || [])
      .slice(0, commentsLenght)
      .map((childComment) => (
        <MemoizedComment key={childComment} id={childComment} />
      ))
  }, [comments, commentsLenght])

  const handleLoadMoreComments = async () => {
    logger.info("Chargement des commentaires")
    if (commentsLenght < totalComments) {
      setCommentsLenght(commentsLenght + LIMIT)
    }
  }

  return (
    <div
      className={`flex p-6 ${isUserPost ? `bg-gray-200` : `bg-gray-50`}  rounded-lg flex-col gap-8`}
    >
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
              {createdAt}
            </p>
          </div>
        </div>
        {isUserPost && (
          <button className="text-gray-500 hover:text-gray-900">
            <MoreVertIcon />
          </button>
        )}
      </div>
      <span>{content}</span>
      {fileUrl && (
        <PhotoProvider
          className=""
          overlayRender={() => (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 text-white px-3 py-2 z-50">
              <p className="text-xs">{user.name}</p>
            </div>
          )}
        >
          <PhotoView src={fileUrl}>
            <img
              src={fileUrl}
              alt="Selected file preview"
              className=" bg-cover bg-center rounded-md cursor-pointer object-cover w-full max-h-96"
            />
          </PhotoView>
        </PhotoProvider>
      )}
      <hr className=" border-0 border-t-2 border-gray-300" />
      <div className="flex gap-4">
        <Like />
        <div className="flex gap-2">
          <button
            data-testid="comment-button"
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
          {commentsLenght < totalComments && (
            <button
              className="bg-gray-700 hover:bg-blue-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
              onClick={handleLoadMoreComments}
            >
              Afficher plus de commentaires
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Post
