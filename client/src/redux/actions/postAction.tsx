import * as api from "../api/postAPI"
import * as types from "../constants/postConstants"
import { PostCreationData, PostChangableData } from "../api/type"

export const addPostAction = (post: PostCreationData) => async (dispatch) => {
  try {
    console.log(post)
    const response = await api.addPost(post)
    const { error } = response
    if (error) {
      console.log("action: " + error)
      dispatch({
        type: types.ADD_POST_FAIL,
        payload: error,
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    } else {
      dispatch({
        type: types.ADD_POST_SUCCESS,
        payload: "",
      })
    }
  } catch (error) {
    console.log("action: " + error.message)
    dispatch({
      type: types.ADD_POST_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
    return {
      success: false,
      message: error.message || "Une erreur s'est produite.",
    }
  }
}

export const getPostsAction = (communityId: string) => async (dispatch) => {
  try {
    const response = await api.getPosts(communityId)
    const { error, data } = response

    if (error) {
      console.log("action: " + error)
      dispatch({
        type: types.GET_POSTS_FAIL,
        payload: error,
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    } else {
      dispatch({
        type: types.GET_POSTS_SUCCESS,
        payload: data,
      })
      return {
        success: true,
        message: "Les publications ont été récupérées avec succès.",
        data: data,
      }
    }
  } catch (error) {
    console.log("action: " + error.message)
    dispatch({
      type: types.GET_POSTS_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}

export const getPostAction = (id: string) => async (dispatch) => {
  try {
    const response = await api.getPost(id)
    const { error, data } = response
    if (error) {
      console.log("action: " + error)
      dispatch({
        type: types.GET_POST_FAIL,
        payload: error,
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    } else {
      dispatch({
        type: types.GET_POST_SUCCESS,
        payload: data,
      })
      return {
        success: true,
        message: "La publication a été récupérée avec succès.",
        data: data,
      }
    }
  } catch (error) {
    console.log("action: " + error.message)
    dispatch({
      type: types.GET_POST_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}

export const deletePostAction = (id: string) => async (dispatch) => {
  try {
    const response = await api.deletePost(id)
    const { error } = response
    if (error) {
      console.log("action: " + error)
      dispatch({
        type: types.DELETE_POST_FAIL,
        payload: error,
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    } else {
      dispatch({
        type: types.DELETE_POST_SUCCESS,
        payload: "",
      })
    }
  } catch (error) {
    console.log("action: " + error.message)
    dispatch({
      type: types.DELETE_POST_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
    return {
      success: false,
      message: error.message || "Une erreur s'est produite.",
    }
  }
}

export const updatePostAction =
  (id: string, post: PostChangableData) => async (dispatch) => {
    try {
      const response = await api.updatePost(id, post)
      const { error } = response
      if (error) {
        console.log("action: " + error)
        dispatch({
          type: types.UPDATE_POST_FAIL,
          payload: error,
        })
        return {
          success: false,
          message: error.message || "Une erreur s'est produite.",
        }
      } else {
        dispatch({
          type: types.UPDATE_POST_SUCCESS,
          payload: "",
        })
      }
    } catch (error) {
      console.log("action: " + error.message)
      dispatch({
        type: types.UPDATE_POST_FAIL,
        payload: error.message || "Une erreur s'est produite.",
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    }
  }

export const addCommentAction =
  (id: string, comment: string) => async (dispatch) => {}

export const getCommentsAction = (id: string) => async (dispatch) => {}
