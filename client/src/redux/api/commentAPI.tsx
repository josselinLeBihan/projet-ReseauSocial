import { API, handleApiError } from "./utils"
import { CommentData, CommentCreationData } from "./type"
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
  data?: CommentData
}> => {
  return await apiRequest<CommentData>("GET", `/comment/${id}`)
}
