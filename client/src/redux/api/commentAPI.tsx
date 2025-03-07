import {
  CommentData,
  CommentCreationData,
  CommentDataFormated,
  CommentChangableData,
  CommentDeleteData,
  UserData,
} from "./type"
import { apiRequest } from "../utils/reduxUtils"

export const addComment = async (
  comment: CommentCreationData,
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/comment`, comment)
}

export const getComment = async (
  id: CommentData["_id"],
): Promise<{
  error?: string
  data?: CommentDataFormated
}> => {
  return await apiRequest<CommentDataFormated>("GET", `/comment/${id}`)
}

export const updateComment = async (
  commentId: CommentData["_id"],
  comment: CommentChangableData,
): Promise<{
  error?: string
  data?: CommentDataFormated
}> => {
  return await apiRequest<CommentDataFormated>(
    "POST",
    `/comment/modify/${commentId}`,
    { comment },
  )
}

export const deleteComment = async (
  comment: CommentDeleteData,
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>(
    "POST",
    `/comment/delete/${comment._id}`,
    comment,
  )
}

export const likeComment = async (
  commentId: CommentData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>(
    "POST",
    `/comment/like/${commentId}/${userId}`,
  )
}
export const unlikeComment = async (
  commentId: CommentData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>(
    "POST",
    `/comment/unlike/${commentId}/${userId}`,
  )
}
