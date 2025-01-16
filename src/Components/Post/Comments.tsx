import React, { memo, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import Like from "./Like"
import CommentIcon from "@mui/icons-material/Comment"

// Mémorise les commentaires pour éviter des re-render non nécessaires
const MemoizedComment = memo(Comments)

interface CommentProps {
  id: string
}

interface Comment {
  _id: string
  content: string
  user: string
  createdAt: string
  comments?: Comment[]
}

function Comments({ id }: CommentProps) {
  // TODO : récupérer les données du commentaire à partir de l'ID (via API ou props)
  const comment: Comment = {
    _id: id,
    content: "Contenu fictif du commentaire", // Valeur fictive
    user: "Utilisateur fictif",
    createdAt: new Date().toISOString(),
    comments: [
      {
        _id: "child-1",
        content: "Sous-commentaire 1",
        user: "Utilisateur 1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "child-2",
        content: "Sous-commentaire 2",
        user: "Utilisateur 2",
        createdAt: new Date().toISOString(),
      },
    ], // Valeurs fictives
  }

  const { content, user, createdAt, comments = [] } = comment

  const [showCommentSection, setShowCommentSection] = useState(false)

  const LIMIT = 5 // Nombre maximum de sous-commentaires à afficher

  // Mémorisation des sous-commentaires
  const memoizedComments = useMemo(() => {
    return comments
      .slice(0, LIMIT)
      .map((childComment) => (
        <MemoizedComment key={childComment._id} id={childComment._id} />
      ))
  }, [comments])

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
            {user}
          </span>
          <p className="font-normal text-sm leading-tight truncate text-zinc-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <span>{content}</span>
      <div className="flex gap-4">
        <Like />
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-gray-900 text-sm"
            onClick={handleCommentOnClick}
          >
            <CommentIcon />
          </button>
          <span>{comments.length}</span>
        </div>
      </div>
      <div className="pl-8">{showCommentSection && memoizedComments}</div>
    </div>
  )
}

export default Comments
