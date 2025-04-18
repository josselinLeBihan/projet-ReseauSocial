import {
  PostCreationData,
  PostChangableData,
  PostData,
  CommentData,
  CommunityData,
  PostDataformated,
  UserData,
} from "./type"
import { apiRequest } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

export const addPost = async (
  post: PostCreationData,
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post`, post)
}

export const getPosts = async (
  limit: number,
  skip: number,
): Promise<{
  error?: string
  data?: PostData[]
}> => {
  return await apiRequest("GET", `/post`, [limit, skip])
}

export const getComPosts = async (
  communityId: CommunityData["_id"],
  limit: number,
  skip: number,
): Promise<{
  error?: string
  data?: [posts: PostDataformated[], totalCommunityPosts: number]
}> => {
  return await apiRequest(
    "GET",
    `/post/community/${communityId}?limit=${limit}&skip=${skip}`,
  )
}

export const getSavedPost = async (
  limit: number,
  skip: number,
): Promise<{
  error?: string
  data?: [posts: PostDataformated[], totalCommunityPosts: number]
}> => {
  return await apiRequest("GET", `/post/saved/?limit=${limit}&skip=${skip}`)
}

export const getUserPosts = async (
  userId: UserData["_id"],
  limit: number,
  skip: number,
): Promise<{
  error?: string
  data?: [posts: PostDataformated[], totalUserPosts: number]
}> => {
  return await apiRequest(
    "GET",
    `/post/user/${userId}?limit=${limit}&skip=${skip}`,
  )
}

export const getUserFeed = async (
  userId: UserData["_id"],
  limit: number,
  skip: number,
): Promise<{
  error?: string
  data?: PostDataformated[]
}> => {
  return await apiRequest(
    "GET",
    `/post/feed/${userId}?limit=${limit}&skip=${skip}`,
  )
}

export const getPost = async (
  postId: PostData["_id"],
): Promise<{
  error?: string
  data?: PostDataformated
}> => {
  return await apiRequest<PostDataformated>("GET", `/post/${postId}`)
}

export const updatePost = async (
  postId: PostData["_id"],
  post: PostChangableData,
): Promise<{
  error?: string
  data?: PostDataformated
}> => {
  return await apiRequest<PostDataformated>(
    "POST",
    `/post/modify/${postId}`,
    post,
  )
}

export const deletePost = async (
  postId: PostData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/delete/${postId}`)
}

export const likePost = async (
  postId: PostData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/like/${postId}`)
}

export const unlikePost = async (
  postId: PostData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/unlike/${postId}`)
}

export const savePost = async (
  postId: PostData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/${postId}/save`)
}

export const unsavePost = async (
  postId: PostData["_id"],
  userId: UserData["_id"],
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/post/${postId}/unsave`)
}
