import * as types from "../constants/authConstants"

const initialState = {
  userData: null,
  userInfo: null,
  refreshToken: null,
  accessToken: null,
  signInError: null,
  signUpError: [],
  successMessage: null,
}

const authReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload ? payload : null,
      }
    case types.SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: payload ? payload : null,
      }
    case types.SET_USER_DATA:
      return {
        ...state,
        userData: payload ? payload : null,
      }
    case types.SET_USER_INFO:
      return {
        ...state,
        userInfo: payload ? payload : null,
      }

    case types.SIGNUP.SUCCESS:
      return {
        ...state,
        signInError: null,
        signUpError: [],
        successMessage: payload ? payload : null,
      }

    case types.SIGNUP.FAIL:
      return {
        ...state,
        successMessage: null,
        signInError: null,
        signUpError: payload ? payload : [],
      }

    case types.SIGNIN.SUCCESS:
      return {
        ...state,
        userData: payload ? payload.user : null,
        accessToken: payload ? payload.accessToken : null,
        refreshToken: payload ? payload.refreshToken : null,
        signInError: null,
        successMessage: payload ? payload : null,
      }

    case types.SIGNIN.FAIL:
      return {
        ...state,
        successMessage: null,
        signUpError: [],
        signInError: payload ? payload : null,
      }

    case types.LOGOUT:
      return {
        ...state,
        userData: null,
        refreshToken: null,
        accessToken: null,
        signInError: null,
        signUpError: [],
        successMessage: null,
        isModeratorOfThisCommunity: false,
      }

    case types.REFRESH_TOKEN.SUCCESS:
      return {
        ...state,
        accessToken: payload ? payload.accessToken : null,
        refreshToken: payload ? payload.refreshToken : null,
      }

    case types.REFRESH_TOKEN.FAIL:
      return {
        ...state,
        userData: null,
        refreshToken: null,
        accessToken: null,
        signUpError: [],
        signInError: null,
        successMessage: null,
      }

    case types.CLEAR_MESSAGE:
      return {
        ...state,
        successMessage: null,
        signInError: null,
        signUpError: [],
      }

    default:
      return state
  }
}

export default authReducer
