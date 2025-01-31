import * as types from "../constants/authConstants"

const initialState = {
  error: null,
  successMessage: null,
}

const commentReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.ADD_COMMENT_FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.GET_COMMENTS_FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}
