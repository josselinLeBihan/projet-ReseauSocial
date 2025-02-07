import * as api from "../api/userAPI"
import * as types from "../constants/userConstants"
import { UserData } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"

export const getUserAction = createAsyncThunkAction<
  [UserData["_id"]],
  UserData
>(types.GET_USER, api.getUser)
