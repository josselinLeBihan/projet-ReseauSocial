import React, { memo, useEffect, useMemo, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import Like from "./Like"
import CommentIcon from "@mui/icons-material/Comment"
import {
  CommentCreationData,
  CommentDataFormated,
  CommentDeleteData,
  CommunityData,
  UserData,
} from "../../redux/api/type"
import {
  deleteCommentAction,
  getCommentAction,
  updateCommentAction,
} from "../../redux/actions/commentAction"
import CommentSubmit from "./CommentSubmit"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { logger } from "../../utils/logger"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DropDownMenu, { linkProps } from "../Modals/DropDownMenu"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ConfirmationModal from "../Modals/ConfirmationModal"
import PostModal from "../Modals/PostModal"
import MessageInfo from "./MessageInfo"

const MemoizedComment = memo(Comment)
const LIMIT = 5

interface CommentProps {
  id: string
  parentId: string
  parentType: CommentDeleteData["parentType"]
  onCommentChange: () => {}
}

function Comment({ id, onCommentChange, parentId, parentType }: CommentProps) {
  const [showCommentSection, setShowCommentSection] = useState(false)
  const [comment, setComment] = useState<CommentDataFormated | null>(null)
  const [commentsLenght, setCommentsLenght] = useState<number>(LIMIT)
  const [isConfirmationModalShow, setIsConfirmationModalShow] =
    useState<boolean>(false)
  const [isSubmitModalShow, setIsSubmitModalShow] = useState<boolean>(false)

  const totalComments = comment?.comments?.length || 0
  const actualUserUser: UserData = useAppSelector(
    (state) => state.auth?.userData,
  )
  const isUserPost: boolean =
    actualUserUser?.userName === comment?.user.userName

  const dispatch = useAppDispatch()

  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

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

  const CommentActions: linkProps[] = [
    {
      name: "Modifier",
      function: () => setIsSubmitModalShow(true),
      icon: <EditIcon />,
    },
    {
      name: "Supprimer",
      function: () => setIsConfirmationModalShow(true),
      icon: <DeleteIcon />,
      warning: true,
    },
  ]

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

  const handleModifications = async (
    content: CommentCreationData["content"],
  ) => {
    try {
      dispatch(updateCommentAction(comment?._id || "", { content }))
    } catch (error) {
      logger.error("Erreur lors de la mise à jour du commentaire :", error)
    }

    onCommentChange()
  }

  const handleSuppression = async () => {
    try {
      const commentDeleteData: CommentDeleteData = {
        _id: id,
        parentId: parentId,
        parentType: parentType,
      }
      dispatch(deleteCommentAction(commentDeleteData))
    } catch (error) {
      logger.error("Erreur lors de la suppression du commentaire :", error)
    }
    setIsConfirmationModalShow(false)

    onCommentChange()
  }

  return (
    <>
      {isConfirmationModalShow && (
        <ConfirmationModal
          title="Confirmation"
          message="Êtes-vous sûr de vouloir supprimer ce post ?"
          onConfirm={handleSuppression}
          onCancel={() => setIsConfirmationModalShow(false)}
          buttonCancelText="Annuler"
          buttonConfirmText="Confirmer"
        />
      )}
      {isSubmitModalShow && (
        <PostModal
          previousBody={comment?.content}
          community={community}
          userName={comment?.user?.userName || ""}
          onPostSubmit={handleModifications}
          onClose={() => setIsSubmitModalShow(false)}
        />
      )}

      <div className="flex flex-col">
        <div className="flex gap-4">
          <img
            src={profilePlaceholder}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className="flex flex-col flex-1 truncate gap-4">
            <MessageInfo
              userName={comment?.user.userName || ""}
              createdAt={comment?.createdAt || ""}
              modifiedAt={comment?.modifiedAt || undefined}
            />
            <span>{comment?.content}</span>
            <div className="flex gap-4">
              {comment && <Like parent={comment} parentType="Comment" />}

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
                  onCommentSubmit={() => onCommentChange()}
                />
                <div className="flex flex-col gap-2">
                  {subComments.map((childId) => (
                    <MemoizedComment
                      key={childId}
                      id={childId}
                      parentId={comment?._id || ""}
                      parentType="comment"
                      onCommentChange={() => onCommentChange()}
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
          {isUserPost && (
            <DropDownMenu icon={<MoreVertIcon />} links={CommentActions} />
          )}
        </div>
      </div>
    </>
  )
}

export default Comment
