import * as api from "../api/userAPI"
import * as types from "../constants/userConstants"
import { UserData } from "../api/type"

export const getUserAction = (id: UserData["_id"]) => async (dispatch) => {
  try {
    const { error, data } = await api.getUser(id)
    if (error) {
      dispatch({
        type: types.GET_USER_FAIL,
        payload: error.message || "Une erreur s'est produite.",
      })
    }
    dispatch({
      type: types.GET_USER_SUCCESS,
      payload: data,
    })
    return {
      success: true,
      message: "L'utilisateur a été récupéré avec succès.",
      data: data,
    }
  } catch (error) {
    dispatch({
      type: types.GET_USER_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}
