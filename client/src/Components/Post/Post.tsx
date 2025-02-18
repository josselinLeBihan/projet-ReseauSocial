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
import { logger } from "../../utils/logger"
import { error } from "loglevel"

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
      logger.debug(`Chargement de l'utilisateur ${post.user}...`)
      try {
        const result = await dispatch(getUserAction(post.user))

        if (result?.data) {
          setUser(result.data)
          logger.debug(`Utilisateur ${post.user} chargé avec succès.`)
        } else {
          throw error("Le resultat de la requête est vide")
        }
      } catch (error) {
        logger.error(
          `Erreur lors du chargement de l'utilisateur ${post.user}:`,
          error,
        )
      }
    }
    fetchUser()
  }, [dispatch, _id])

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  //TODO gérer la limite d'affichage des commentaires
  const LIMIT = 5

  const memoizedComments = useMemo(() => {
    return (comments || [])
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
        </div>
      )}
    </div>
  )
}

export default Post
