import {
  PostCreationData,
  PostChangableData,
  PostData,
  CommentData,
  CommunityData,
} from "./type"
import { apiRequest } from "../utils/reduxUtils"

export const addPost = async (
  post: PostCreationData,
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post`, post)
}

export const getPosts = async (
  communityId: CommunityData["_id"],
): Promise<{
  error?: string
  data?: PostData[]
}> => {
  return await apiRequest<PostData[]>("GET", `/post/community/${communityId}`)
}

export const getPost = async (
  postId: PostData["_id"],
): Promise<{
  error?: string
  data?: PostData
}> => {
  return await apiRequest<PostData>("GET", `/post/${postId}`)
}

export const updatePost = async (
  postId: PostData["_id"],
  post: PostChangableData,
): Promise<{
  error?: string
  data?: PostData
}> => {
  return await apiRequest<PostData>("POST", `/post/:${postId}/update`, post)
}

export const deletePost = async (
  postId: PostData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/:${postId}/delete`)
}
