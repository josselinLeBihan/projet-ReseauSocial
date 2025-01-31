import React, { memo, useEffect, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import Like from "./Like"
import CommentIcon from "@mui/icons-material/Comment"
import { Comment } from "@mui/icons-material"
import { tempComment } from "../../Data/Data"
import { useDispatch } from "react-redux"
import { CommentData, UserData } from "../../redux/api/type"
import { getCommentAction } from "../../redux/actions/commentAction"

// Mémorise les commentaires pour éviter des re-render non nécessaires
const MemoizedComment = memo(Comments)

interface CommentProps {
  id: string
}

function Comments({ id }: CommentProps) {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [comment, setComment] = useState<CommentData | null>(null)
  // TODO : récupérer les données du commentaire à partir de l'ID (via API)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const result = await dispatch<any>(getCommentAction(id))
      setComment(result.data)
    }
    fetchUser()
  }, [dispatch, id])

  // Mémorisation des sous-commentaires
  const LIMIT = 5 // Nombre maximum de sous-commentaires à afficher

  const memoizedComments = useMemo(() => {
    return (comment?.childComments ?? [])
      .slice(0, LIMIT)
      .map((childComment) => (
        <MemoizedComment key={childComment} id={childComment} />
      ))
  }, [comment])

  const handleCommentOnClick = () => {
    setShowCommentSection(!showCommentSection)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <img
          src={profilePlaceholder}
          alt="profileImage"
          className="w-11 h-11 shrink-0 rounded-full"
        />
        <div className="flex flex-col flex-1 truncate">
          <span className="truncate relative pr-8 font-medium text-gray-900">
            {comment?.user?.name}
          </span>
          <p className="font-normal text-sm leading-tight truncate text-zinc-500">
            {comment?.createdAt}
          </p>
        </div>
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
          <span>{comment?.childComments?.length}</span>
        </div>
      </div>
      <div className="pl-8">{showCommentSection && memoizedComments}</div>
    </div>
  )
}

export default Comments
