import * as api from "../api/commentAPI"
import * as types from "../constants/commentConstants"
import { CommentData, CommentCreationData } from "../api/type"

export const getCommentAction = (postId: string) => async (dispatch) => {
  try {
    const response = await api.getComment(postId)
    const { error, data } = response

    if (error) {
      console.log("action: " + error)
      dispatch({
        type: types.GET_COMMENTS_FAIL,
        payload: error,
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    } else {
      dispatch({
        type: types.GET_COMMENTS_SUCCESS,
        payload: data,
      })
      return {
        success: true,
        message: "Le commentaire a été réccupéré avec succès.",
        data: data,
      }
    }
  } catch (error) {
    console.log("action: " + error.message)
    dispatch({
      type: types.GET_COMMENTS_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
    return {
      success: false,
      message: error.message || "Une erreur s'est produite.",
    }
  }
}

export const addCommentAction =
  (comment: CommentCreationData) => async (dispatch) => {
    try {
      const response = await api.addComment(comment)
      const { error } = response
      if (error) {
        console.log("action: " + error)
        dispatch({
          type: types.ADD_COMMENT_FAIL,
          payload: error,
        })
        return {
          success: false,
          message: error.message || "Une erreur s'est produite.",
        }
      } else {
        dispatch({
          type: types.ADD_COMMENT_SUCCESS,
          payload: "",
        })
      }
    } catch (error) {
      console.log("action: " + error.message)
      dispatch({
        type: types.ADD_COMMENT_FAIL,
        payload: error.message || "Une erreur s'est produite.",
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    }
  }
