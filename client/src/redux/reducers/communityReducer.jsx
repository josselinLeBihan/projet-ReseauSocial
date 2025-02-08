import * as types from "../constants/communityConstants"

const initialState = {
  communities: [],
  error: null,
  community: null,
  joinedCommunities: [],
  notJoinedCommunities: [],
}

const communityReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_COMMUNITIES.SUCCESS:
      return {
        ...state,
        communities: Array.isArray(payload) ? payload : [],
      }
    case types.GET_COMMUNITIES.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_COMMUNITY.SUCCESS:
      return {
        ...state,
        community: payload ? payload : null,
      }
    case types.GET_COMMUNITY.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_JOINED_COMMUNITIES.SUCCESS:
      return {
        ...state,
        joinedCommunities: payload ? payload : null,
        error: null,
      }
    case types.GET_JOINED_COMMUNITIES.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_NOT_JOINED_COMMUNITIES.SUCCESS:
      return {
        ...state,
        notJoinedCommunities: payload ? payload : [],
        error: null,
      }
    case types.GET_NOT_JOINED_COMMUNITIES.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.JOIN_COMMUNITY.SUCCESS:
      return {
        ...state,
        joinedCommunities: [...state.joinedCommunities, payload],
        notJoinedCommunities: state.notJoinedCommunities.filter(
          (community) => community.name !== payload.name,
        ),
        communityError: null,
      }
    case types.JOIN_COMMUNITY.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.LEAVE_COMMUNITY_SUCCESS:
      return {
        ...state,
        notJoinedCommunities: [...state.joinedCommunities, payload],
        joinedCommunities: state.notJoinedCommunities.filter(
          (community) => community.name !== payload.name,
        ),
        error: null,
      }
    case types.LEAVE_COMMUNITY.FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}

export default communityReducer
