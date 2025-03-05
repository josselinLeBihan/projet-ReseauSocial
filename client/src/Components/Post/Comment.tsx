import React, { memo, useEffect, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import Like from "./Like"
import CommentIcon from "@mui/icons-material/Comment"
import { CommentDataFormated } from "../../redux/api/type"
import { getCommentAction } from "../../redux/actions/commentAction"
import CommentSubmit from "./CommentSubmit"
import { useAppDispatch } from "../../redux/store"
import { logger } from "../../utils/logger"

const MemoizedComment = memo(Comment)
const LIMIT = 5

interface CommentProps {
  id: string
  onCommentSubmit: () => {}
}

function Comment({ id, onCommentSubmit }: CommentProps) {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [comment, setComment] = useState<CommentDataFormated | null>(null)
  const [commentsLenght, setCommentsLenght] = useState<number>(LIMIT)
  const totalComments = comment?.comments?.length || 0

  const dispatch = useAppDispatch()

  useEffect(() => {
    let isMounted = true
    logger.debug(`Chargement du commentaire ${id}...`)

    const fetchComment = async () => {
      try {
        const result = await dispatch(getCommentAction(id))
        if (isMounted && result?.data) {
          setComment(result.data)
          logger.debug(`Commentaire ${id} chargé avec succès.`)
        }
      } catch (error) {
        logger.error(`Erreur lors du chargement du commentaire ${id} :`, error)
      }
    }

    fetchComment()

    return () => {
      isMounted = false
    }
  }, [id, dispatch])

  const subComments = useMemo(() => {
    return (comment?.comments ?? []).slice(0, commentsLenght)
  }, [comment])

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  const handleLoadMoreComments = async () => {
    logger.info("Chargement des commentaires")
    if (commentsLenght < totalComments) {
      setCommentsLenght(commentsLenght + LIMIT)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <img
          src={profilePlaceholder}
          alt="profileImage"
          className="w-11 h-11 shrink-0 rounded-full"
        />
        <div className="flex flex-col flex-1 truncate gap-4">
          <div className="flex flex-col flex-1 gap-0">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              {comment?.user?.userName}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              {comment?.createdAt}
            </p>
          </div>

          <span>{comment?.content}</span>
          <div className="flex gap-4">
            <Like />
            <div className="flex gap-2">
              <button
                className="text-gray-500 hover:text-gray-900 text-sm"
                onClick={handleCommentOnClick}
              >
                <CommentIcon />
              </button>
              <span>{comment?.comments?.length}</span>
            </div>
          </div>
          {showCommentSection && (
            <div className="gap-4 flex-col flex ">
              <CommentSubmit
                parentId={comment?._id || ""}
                parentType="comment"
                onCommentSubmit={() => onCommentSubmit()}
              />
              <div className="flex flex-col gap-2">
                {subComments.map((childId) => (
                  <MemoizedComment
                    key={childId}
                    id={childId}
                    onCommentSubmit={() => onCommentSubmit()}
                  />
                ))}
              </div>
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
      </div>
    </div>
  )
}

export default Comment
