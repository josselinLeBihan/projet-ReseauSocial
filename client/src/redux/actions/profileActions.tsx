import { UserData, UserInfo, PublicUserInfo } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import * as types from "../constants/userConstants"
import * as api from "../api/profileAPI"

export const getProfileAction = createAsyncThunkAction<
  [UserData["_id"], UserInfo["_id"]],
  PublicUserInfo
>(types.GET_PROFILE, api.getProfile)

export const followUserAction = (id: UserInfo["_id"]) => async (dispatch) => {
  try {
    const { error } = await api.followUser(id)
    if (error) {
      throw new Error(error)
    }
    dispatch({
      type: types.CHANGE_FOLLOW_STATUS.SUCCESS,
      payload: { isFollowing: true },
    })
  } catch (error) {
    dispatch({
      type: types.CHANGE_FOLLOW_STATUS.FAIL,
      payload: error.message,
    })
  }
}

export const unfollowUserAction = (id: UserInfo["_id"]) => async (dispatch) => {
  try {
    const { error } = await api.unfollowUser(id)
    if (error) {
      throw new Error(error)
    }

    dispatch({
      type: types.CHANGE_FOLLOW_STATUS.SUCCESS,
      payload: { isFollowing: false },
    })
  } catch (error) {
    dispatch({
      type: types.CHANGE_FOLLOW_STATUS.FAIL,
      payload: error.message,
    })
  }
}
