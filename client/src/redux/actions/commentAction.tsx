import * as api from "../api/commentAPI"
import * as types from "../constants/commentConstants"
import {
  CommentData,
  CommentCreationData,
  CommentDataFormated,
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
