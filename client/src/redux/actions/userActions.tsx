import * as api from "../api/userAPI"
import * as types from "../constants/userConstants"
import * as postTypes from "../constants/postConstants"
import { ActualUserInfo, UserData } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

/*
export const getUserAction = createAsyncThunkAction<
  [UserData["_id"]],
  ActualUserInfo
>(types.GET_USER, api.getUser)

*/

export const getUserAction = (id) => {
  return async (dispatch: any) => {
    try {
      await logger.info(`Action ${types.GET_USER.REQUEST} déclenchée avec`, id)

      const { error, data } = await api.getUser(id)

      await logger.debug(`Action ${types.GET_USER.SUCCESS} réussie`, data)

      dispatch({
        type: types.GET_USER.SUCCESS,
        payload: data,
      })

      dispatch({
        type: postTypes.GET_USER_POSTS.SUCCESS,
        payload: {
          posts: data?.posts || [],
          totalUserPosts: data?.totalPosts || 0,
        },
      })

      return { error, data }
    } catch (error) {
      dispatch({
        type: types.GET_USER.FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
}

export const updateUserAction = createAsyncThunkAction<
  [UserData["_id"], FormData],
  void
>(types.UPDATE_USER, api.updateUser)
