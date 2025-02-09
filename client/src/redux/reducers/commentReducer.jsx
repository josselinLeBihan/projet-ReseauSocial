import * as types from "../constants/commentConstants"

const initialState = {
  error: null,
  successMessage: null,
}

const commentReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.ADD_COMMENT.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.ADD_COMMENT.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_COMMENT.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.GET_COMMENT.FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}

export default commentReducer
