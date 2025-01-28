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
    case types.GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: Array.isArray(payload) ? payload : [],
      }
    case types.GET_POSTS_FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.ADD_POST_SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.ADD_POST_FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}
