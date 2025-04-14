import React, { useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { PostDataformated } from "../../redux/api/type"
import useToggle from "../../hook/useToggle"
import { UserData } from "../../App"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import {
  savePostAction,
  unsavePostAction,
} from "../../redux/actions/postAction"

import { logger } from "../../utils/logger"

interface SaveProps {
  parent: PostDataformated
}

const Save = ({ parent }: SaveProps) => {
  const actualUser: UserData = useAppSelector((state) => state.auth?.userData)
  const [isSaved, toggleSaved] = useToggle(parent.saved)
  const [isLoading, toggleLoading] = useToggle(false)

  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (isLoading) return
    try {
      toggleLoading()

      if (isSaved) {
        logger.info(`Unsave du post en cours`, parent._id)
        await dispatch(unsavePostAction(parent._id, actualUser._id))
      } else {
        logger.info(`Save du post en cours`, parent._id)
        await dispatch(savePostAction(parent._id, actualUser._id))
      }

      toggleSaved()
    } catch (error) {
      logger.error(`Erreur lors de l'action de save/unsave`, error)
    } finally {
      toggleLoading()
    }
  }

  return (
    <div className="flex gap-2">
      <button
        className={
          isSaved
            ? `text-teal-500 hover:text-teal-900 text-sms`
            : `text-gray-500 hover:text-gray-900 text-sms`
        }
        onClick={handleClick}
      >
        {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </button>
    </div>
  )
}

export default Save
