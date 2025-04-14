import * as api from "../api/postAPI"
import * as types from "../constants/postConstants"
import {
  PostCreationData,
  PostChangableData,
  CommunityData,
  PostData,
  PostDataformated,
  UserData,
} from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

export const addPostAction = createAsyncThunkAction<[PostCreationData], string>(
  types.ADD_POST,
  async (postData) => {
    try {
      const response = await api.addPost(postData)
      logger.info("Post added successfully", response.data)
      return response
    } catch (error) {
      logger.error("Error adding post", error)
      throw error
    }
  },
)

// export const getPostsAction = createAsyncThunkAction<
//   [CommunityData["_id"], number],
//   PostData[]
// >(types.GET_POSTS, async (communityId) => {
//   try {
//     const response = await api.getPosts(communityId)
//     logger.info("Posts fetched successfully", response.data)
//     return response
//   } catch (error) {
//     logger.error("Error fetching posts", error)
//     throw error
//   }
// })

export const getComPostsAction =
  (communityId: CommunityData["_id"], limit: number, skip: number) =>
  async (dispatch) => {
    await logger.info(`Action ${types.GET_COM_POSTS.REQUEST} déclenchée avec`, {
      communityId,
      limit,
      skip,
    })
    try {
      const { error, data } = await api.getComPosts(communityId, limit, skip)

      if (error || !data) {
        throw new Error(error || "Pas de données reçues")
      }

      const { posts, totalCommunityPosts } = data
      await logger.debug(`Action ${types.GET_COM_POSTS.SUCCESS} réussie`, {
        posts,
        totalCommunityPosts,
      })

      dispatch({
        type: types.GET_COM_POSTS.SUCCESS,
        payload: {
          page: skip / limit + 1,
          posts: posts,
          totalCommunityPosts: totalCommunityPosts,
        },
      })
    } catch (error) {
      await logger.error(
        `Erreur dans l'action ${types.GET_COM_POSTS.REQUEST}`,
        error.message,
      )
      dispatch({
        type: types.GET_COM_POSTS.FAIL,
        payload: error.message,
      })
    }
  }

export const getUserPostsAction =
  (userId: UserData["_id"], limit: number, skip: number) =>
  async (dispatch) => {
    await logger.info(
      `Action ${types.GET_USER_POSTS.REQUEST} déclenchée avec`,
      {
        userId,
        limit,
        skip,
      },
    )
    try {
      const { error, data } = await api.getUserPosts(userId, limit, skip)

      if (error || !data) {
        throw new Error(error || "Pas de données reçues")
      }

      const { posts, totalCommunityPosts } = data
      await logger.debug(`Action ${types.GET_USER_POSTS.SUCCESS} réussie`, {
        posts,
        totalCommunityPosts,
      })

      dispatch({
        type: types.GET_USER_POSTS.SUCCESS,
        payload: {
          page: skip / limit + 1,
          posts: posts,
          totalCommunityPosts: totalCommunityPosts,
        },
      })
    } catch (error) {
      await logger.error(
        `Erreur dans l'action ${types.GET_USER_POSTS.REQUEST}`,
        error.message,
      )
      dispatch({
        type: types.GET_USER_POSTS.FAIL,
        payload: error.message,
      })
    }
  }
export const getUserFeedAction =
  (userId: UserData["_id"], limit: number, skip: number) =>
  async (dispatch) => {
    await logger.info(`Action ${types.GET_USER_FEED.REQUEST} déclenchée avec`, {
      userId,
      limit,
      skip,
    })
    try {
      const { error, data } = await api.getUserFeed(userId, limit, skip)

      if (error || !data) {
        throw new Error(error || "Pas de données reçues")
      }

      await logger.debug(`Action ${types.GET_USER_FEED.SUCCESS} réussie`, {
        data,
      })

      dispatch({
        type: types.GET_USER_FEED.SUCCESS,
        payload: {
          page: skip / limit + 1,
          posts: data,
        },
      })
    } catch (error) {
      await logger.error(
        `Erreur dans l'action ${types.GET_USER_FEED.REQUEST}`,
        error.message,
      )
      dispatch({
        type: types.GET_USER_FEED.FAIL,
        payload: error.message,
      })
    }
  }

export const getPostAction = createAsyncThunkAction<
  [PostData["_id"]],
  PostDataformated
>(types.GET_POST, api.getPost)

export const deletePostAction = createAsyncThunkAction<
  [PostData["_id"]],
  string
>(types.DELETE_POST, api.deletePost)

export const updatePostAction = createAsyncThunkAction<
  [PostData["_id"], PostChangableData],
  PostDataformated
>(types.UPDATE_POST, api.updatePost)

export const likePostAction = createAsyncThunkAction<
  [PostData["_id"], UserData["_id"]],
  String
>(types.LIKE_POST, api.likePost)

export const unlikePostAction = createAsyncThunkAction<
  [PostData["_id"], UserData["_id"]],
  String
>(types.UNLIKE_POST, api.unlikePost)
