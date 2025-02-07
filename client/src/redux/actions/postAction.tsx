import * as api from "../api/postAPI"
import * as types from "../constants/postConstants"
import {
  PostCreationData,
  PostChangableData,
  CommunityData,
  PostData,
} from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"

export const addPostAction = createAsyncThunkAction<[PostCreationData], string>(
  types.ADD_POST,
  api.addPost,
)

export const getPostsAction = createAsyncThunkAction<
  [CommunityData["_id"]],
  PostData[]
>(types.GET_POSTS, api.getPosts)

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
