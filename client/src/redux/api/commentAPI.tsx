import { CommentData, CommentCreationData, CommentDataFormated } from "./type"
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
