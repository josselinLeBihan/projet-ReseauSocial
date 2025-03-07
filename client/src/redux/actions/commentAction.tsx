import * as api from "../api/commentAPI"
import * as types from "../constants/commentConstants"
import {
  CommentData,
  CommentCreationData,
  CommentDataFormated,
  CommentChangableData,
  CommentDeleteData,
  UserData,
} from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"

export const getCommentAction = createAsyncThunkAction<
  [CommentData["_id"]],
  CommentDataFormated
>(types.GET_COMMENT, api.getComment)

export const addCommentAction = createAsyncThunkAction<
  [CommentCreationData],
  string
>(types.ADD_COMMENT, api.addComment)

export const deleteCommentAction = createAsyncThunkAction<
  [CommentDeleteData],
  string
>(types.DELETE_COMMENT, api.deleteComment)

export const updateCommentAction = createAsyncThunkAction<
  [CommentData["_id"], CommentChangableData],
  CommentDataFormated
>(types.UPDATE_COMMENT, api.updateComment)

export const likeCommentAction = createAsyncThunkAction<
  [CommentData["_id"], UserData["_id"]],
  String
>(types.LIKE_COMMENT, api.likeComment)

export const unlikeCommentAction = createAsyncThunkAction<
  [CommentData["_id"], UserData["_id"]],
  String
>(types.UNLIKE_COMMENT, api.unlikeComment)
