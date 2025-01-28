import * as types from "../constants/communityConstants"

const initialState = {
  communities: [],
  error: null,
  community: null,
}

const communityReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_COMMUNITIES_SUCCESS:
      return {
        ...state,
        communities: Array.isArray(payload) ? payload : [],
      }
    case types.GET_COMMUNITIES_FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_COMMUNITY_SUCCESS:
      return {
        ...state,
        community: payload ? payload : null,
      }
    case types.GET_COMMUNITY_FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}

export default communityReducer
