import * as types from "../constants/userConstants"

const initialState = {
  user: null,
  followingUsers: [],
  publicUserProfile: null,
  isFollowing: null,
  userError: null,
}

const userReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_USER.SUCCESS:
      return {
        ...state,
        user: payload ? payload : null,
      }
    case types.GET_USER.FAIL:
      return {
        ...state,
        userError: payload,
      }
    case types.UPDATE_USER.FAIL:
      return {
        ...state,
        userError: payload,
      }
    case types.GET_PROFILE.SUCCESS:
      return {
        ...state,
        publicUserProfile: payload ? payload : null,
        isFollowing: payload ? payload.isFollowing : null,
      }
    case types.GET_PROFILE.FAIL:
      return {
        ...state,
        userError: payload,
      }
    case types.CHANGE_FOLLOW_STATUS.SUCCESS:
      return {
        ...state,
        isFollowing: payload ? payload.isFollowing : null,
      }
    case types.CHANGE_FOLLOW_STATUS_FAIL:
      return { ...state, userError: payload }
    default:
      return state
  }
}

export default userReducer
