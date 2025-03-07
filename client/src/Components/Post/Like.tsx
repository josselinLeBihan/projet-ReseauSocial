import React, { useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import { CommentDataFormated, PostDataformated } from "../../redux/api/type"
import useToggle from "../../hook/useToggle"
import { UserData } from "../../App"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import {
  likePostAction,
  unlikePostAction,
} from "../../redux/actions/postAction"
import {
  likeCommentAction,
  unlikeCommentAction,
} from "../../redux/actions/commentAction"
import { logger } from "../../utils/logger"

interface LikeProps {
  parent: PostDataformated | CommentDataFormated
  parentType: "Post" | "Comment"
}

const Like = ({ parent, parentType }: LikeProps) => {
  const [numberLikes, setNumberLikes] = useState(parent.likes.length)
  const actualUser: UserData = useAppSelector((state) => state.auth?.userData)
  const [isLiked, toggleLiked] = useToggle(
    parent.likes.includes(actualUser?._id),
  )
  const [isLoading, toggleLoading] = useToggle(false)

  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (isLoading) return
    try {
      toggleLoading()
      if (parentType === "Post") {
        if (isLiked) {
          logger.info(`Unlike du post en cours`, parent._id)
          await dispatch(unlikePostAction(parent._id, actualUser._id))
          setNumberLikes((prev) => prev - 1)
        } else {
          logger.info(`Like du post en cours`, parent._id)
          await dispatch(likePostAction(parent._id, actualUser._id))
          setNumberLikes((prev) => prev + 1)
        }
      } else {
        if (isLiked) {
          logger.info(`Unlike du commentaire en cours`, parent._id)
          await dispatch(unlikeCommentAction(parent._id, actualUser._id))
          setNumberLikes((prev) => prev - 1)
        } else {
          logger.info(`Like du commentaire en cours`, parent._id)
          await dispatch(likeCommentAction(parent._id, actualUser._id))
          setNumberLikes((prev) => prev + 1)
        }
      }
      toggleLiked()
    } catch (error) {
      logger.error(`Erreur lors de l'action de like/unlike`, error)
    } finally {
      toggleLoading()
    }
  }

  return (
    <div className="flex gap-2">
      <button
        className={
          isLiked
            ? `text-teal-500 hover:text-teal-900 text-sms`
            : `text-gray-500 hover:text-gray-900 text-sms`
        }
        onClick={handleClick}
      >
        <ThumbUpIcon />
      </button>
      <span>{numberLikes}</span>
    </div>
  )
}

export default Like
