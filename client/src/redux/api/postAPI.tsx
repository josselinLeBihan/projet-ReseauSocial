import { API, handleApiError } from "./utils"
import {
  PostCreationData,
  PostChangableData,
  PostData,
  CommentData,
} from "./type"

export const addPost = async (post: PostCreationData) => {
  try {
    const { error, data } = await API.post("/post", post)
    return data
  } catch (error) {
    handleApiError(error)
  }
}

export const getPosts = async (communityId: PostData["_id"]) => {
  try {
    const response = await API.get(`/post/community/${communityId}`)
    return response
  } catch (error) {
    handleApiError(error)
  }
}

export const getPost = async (id: string) => {}

export const updatePost = async (id: string, post: PostChangableData) => {}

export const deletePost = async (id: string) => {}
