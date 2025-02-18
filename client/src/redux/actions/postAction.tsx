import * as api from "../api/postAPI"
import * as types from "../constants/postConstants"
import {
  PostCreationData,
  PostChangableData,
  CommunityData,
  PostData,
} from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

export const addPostAction = createAsyncThunkAction<[PostCreationData], string>(
  types.ADD_POST,
  async (postData) => {
    try {
      const response = await api.addPost(postData)
      logger.info("Post added successfully", response.data)
      return response
    } catch (error) {
      logger.error("Error adding post", error)
      throw error
    }
  },
)

export const getPostsAction = createAsyncThunkAction<
  [CommunityData["_id"]],
  PostData[]
>(types.GET_POSTS, async (communityId) => {
  try {
    const response = await api.getPosts(communityId)
    logger.info("Posts fetched successfully", response.data)
    return response
  } catch (error) {
    logger.error("Error fetching posts", error)
    throw error
  }
})

export const getPostAction = createAsyncThunkAction<
  [PostData["_id"]],
  PostData
>(types.GET_POST, api.getPost)

export const deletePostAction = createAsyncThunkAction<
  [PostData["_id"]],
  string
>(types.DELETE_POST, api.deletePost)

export const updatePostAction = createAsyncThunkAction<
  [PostData["_id"], PostChangableData],
  PostData
>(types.UPDATE_POST, api.updatePost)
