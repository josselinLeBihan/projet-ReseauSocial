import { API, handleApiError } from "./utils"
import { CommentData, CommentCreationData } from "./type"

export const addComment = async (comment: CommentCreationData) => {
  try {
    const { error, data } = await API.post("/comment", comment)
    return data
  } catch (error) {
    handleApiError(error)
  }
}

export const getComment = async (postId: string) => {
  try {
    const response = await API.get(`/comment/post/${postId}`)
    return response
  } catch (error) {
    handleApiError(error)
  }
}
