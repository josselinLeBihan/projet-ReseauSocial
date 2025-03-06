import React from "react"
import { useState, useMemo } from "react"
import Comment from "./Comment"
import CommentSubmit from "./CommentSubmit"

interface CommentListProps {
  comments: string[]
  parentId: string
  parentType: "post" | "comment"
  onCommentChange: () => void
}

const LIMIT = 5

const CommentList = ({
  comments,
  parentId,
  parentType,
  onCommentChange,
}: CommentListProps) => {
  const [commentsLenght, setCommentsLenght] = useState(LIMIT)

  const visibleComments = useMemo(
    () => comments.slice(0, commentsLenght),
    [comments, commentsLenght],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-col">
        {visibleComments.map((childId) => (
          <Comment
            key={childId}
            id={childId}
            parentId={parentId}
            parentType={parentType}
            onCommentChange={onCommentChange}
          />
        ))}
      </div>
      {commentsLenght < comments.length && (
        <button
          className="bg-gray-700 hover:bg-blue-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
          onClick={() => setCommentsLenght(commentsLenght + LIMIT)}
        >
          Afficher plus de commentaires
        </button>
      )}
    </div>
  )
}

export default CommentList
