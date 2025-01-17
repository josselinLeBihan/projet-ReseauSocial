import React, { memo, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import Like from "./Like"
import CommentIcon from "@mui/icons-material/Comment"
import { Comment } from "@mui/icons-material"

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
  childComments?: CommentProps[]
}

const tempComment: Comment[] = [
  {
    _id: "parent_1",
    content: "This is temporate parent comment",
    user: "josselin",
    createdAt: new Date().toISOString(),
    childComments: [{ id: "child1" }, { id: "child2" }],
  },
  {
    _id: "child1",
    content: "This is child comment 1",
    user: "user1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "child2",
    content: "This is child comment 2",
    user: "user2",
    createdAt: new Date().toISOString(),
  },
]

function Comments({ id }: CommentProps) {
  const [showCommentSection, setShowCommentSection] = useState(false)
  // TODO : récupérer les données du commentaire à partir de l'ID (via API ou props)
  const commentData = tempComment.find((comment) => comment._id === id)
  const content = commentData?.content || ""
  const user = commentData?.user || "Unknown"
  const createdAt = commentData?.createdAt || ""
  const childCommentsID = commentData?.childComments || []

  // Récupération des sous-commentaires à partir des IDs
  const childComments: Comment[] = useMemo(() => {
    return (
      childCommentsID
        ?.map((child) =>
          tempComment.find((comment) => comment._id === child.id),
        )
        .filter((comment): comment is Comment => comment !== undefined) || []
    )
  }, [childCommentsID])

  // Mémorisation des sous-commentaires
  const LIMIT = 5 // Nombre maximum de sous-commentaires à afficher

  const memoizedComments = useMemo(() => {
    return childComments
      .slice(0, LIMIT)
      .map((childComment) => (
        <MemoizedComment key={childComment._id} id={childComment._id} />
      ))
  }, [childComments])

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
          <span>{childComments.length}</span>
        </div>
      </div>
      <div className="pl-8">{showCommentSection && memoizedComments}</div>
    </div>
  )
}

export default Comments
