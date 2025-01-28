import { data } from "react-router-dom"
import * as api from "../api/communityAPI"
import * as types from "../constants/communityConstants"

export const getCommunitiesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunities()
    dispatch({
      type: types.GET_COMMUNITIES_SUCCESS,
      payload: data?.data,
    })
  } catch (error) {
    console.error("Error in getCommunitiesAction:", error)
    dispatch({
      type: types.GET_COMMUNITIES_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}

export const getCommunityAction = (name) => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunity(name)
    dispatch({
      type: types.GET_COMMUNITY_SUCCESS,
      payload: data?.data,
    })
  } catch (error) {
    console.error("Error in getCommunitiesAction:", error)
    dispatch({
      type: types.GET_COMMUNITY_FAIL,
      payload: error.message || "Une erreur s'est produite.",
    })
  }
}
