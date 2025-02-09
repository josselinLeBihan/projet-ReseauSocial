import * as types from "../constants/postConstants"

const initialState = {
  posts: [],
  error: null,
  post: null,
  successMessage: null,
}

const postReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_POSTS.SUCCESS:
      return {
        ...state,
        posts: Array.isArray(payload) ? payload : [],
      }
    case types.GET_POSTS.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.ADD_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.ADD_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.DELETE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.DELETE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.UPDATE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.UPDATE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}

export default postReducer
