import * as api from "../api/userAPI"
import * as types from "../constants/userConstants"
import { UserData } from "../api/type"

export const getUserAction = (id: UserData["_id"]) => async (dispatch) => {
  try {
    const { error, data } = await api.getUser(id)

    if (error) {
      throw new Error(error)
    }

    dispatch({
      type: types.GET_USER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: types.GET_USER_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}
