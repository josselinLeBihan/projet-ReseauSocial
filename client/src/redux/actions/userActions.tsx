import * as api from "../api/userAPI"
import * as types from "../constants/userConstants"
import { UserData, UserInfo } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"

export const getUserAction = createAsyncThunkAction<
  [UserData["_id"]],
  UserInfo
>(types.GET_USER, api.getUser)
