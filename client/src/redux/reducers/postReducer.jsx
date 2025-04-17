import { error } from "loglevel"
import * as types from "../constants/postConstants"
import { logger } from "../../utils/logger"

const initialState = {
  posts: [],
  communityPosts: [],
  userPosts: [],
  userFeedPosts: [],
  userSavedPosts: [],
  error: null,
  post: null,
  successMessage: null,
  totalSavedPosts: 0,
  totalCommunityPosts: 0,
  totalUserPosts: 0,
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
    case types.GET_COM_POSTS.SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          communityPosts: Array.isArray(payload.posts) ? payload.posts : [],
          totalCommunityPosts: payload ? payload.totalCommunityPosts : 0,
          error: null,
        }
      } else {
        return {
          ...state,
          communityPosts: [
            ...state.communityPosts,
            ...(payload ? payload.posts : []),
          ],
          totalCommunityPosts: payload ? payload.totalCommunityPosts : 0,
          error: null,
        }
      }
    case types.GET_COM_POSTS.FAIL:
      return {
        ...state,
        error: payload,
      }

    case types.GET_USER_POSTS.SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          userPosts: Array.isArray(payload.posts) ? payload.posts : [],
          totalUserPosts: payload ? payload.totalUserPosts : 0,
          error: null,
        }
      } else {
        return {
          ...state,
          userPosts: [...state.userPosts, ...(payload ? payload.posts : [])],
          totalUserPosts: payload ? payload.totalUserPosts : 0,
          error: null,
        }
      }
    case types.GET_USER_POSTS.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_USER_FEED.SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          userFeedPosts: Array.isArray(payload.posts) ? payload.posts : [],
          error: null,
        }
      } else {
        return {
          ...state,
          userFeedPosts: [
            ...state.userFeedPosts,
            ...(payload ? payload.posts : []),
          ],
          error: null,
        }
      }
    case types.GET_USER_FEED.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.GET_SAVED_POST.SUCCESS:
      if (payload.page === 1) {
        return {
          ...state,
          userSavedPosts: Array.isArray(payload.posts) ? payload.posts : [],
          totalSavedPosts: payload ? payload.totalSavedPosts : 0,
          error: null,
        }
      } else {
        return {
          ...state,
          userSavedPosts: [
            ...state.userSavedPosts,
            ...(payload ? payload.posts : []),
          ],
          totalSavedPosts: payload ? payload.totalSavedPosts : 0,
          error: null,
        }
      }
    case types.GET_SAVED_POST.FAIL:
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
    case types.LIKE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.LIKE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.UNLIKE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.UNLIKE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.SAVE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.SAVE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    case types.UNSAVE_POST.SUCCESS:
      return {
        ...state,
        successMessage: payload ? payload : null,
      }
    case types.UNSAVE_POST.FAIL:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}

export default postReducer
