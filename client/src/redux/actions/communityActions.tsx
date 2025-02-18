import * as api from "../api/communityAPI"
import * as types from "../constants/communityConstants"
import { CommunityData, UserData } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"
import { getUserAction } from "./userActions"

export const getCommunitiesAction = createAsyncThunkAction<[], CommunityData[]>(
  types.GET_COMMUNITIES,
  api.getCommunities,
)

export const getCommunityAction = createAsyncThunkAction<
  [CommunityData["name"]],
  CommunityData
>(types.GET_COMMUNITY, api.getCommunity)

export const joinCommunityAndFetchDataAction =
  (community: CommunityData, userId: UserData["_id"]) => async (dispatch) => {
    try {
      await dispatch(joinCommunityAction(community._id, userId))
      await dispatch(getCommunityAction(community.name))
      //await dispatch(getJoinedCommunitiesAction()) TODO
      //await dispatch(getNotJoinedCommunitiesAction()) TODO

      if (userId) {
        await dispatch(getUserAction(userId))
        //await dispatch(getSavedPostsAction()) TODO
      }
    } catch (error) {
      dispatch({
        type: types.JOIN_COMMUNITY.FAIL,
        payload: "Erreur lors de la tentative de rejoindre la communauté",
        meta: {
          requiresAuth: true,
        },
      })
      logger.error(
        "Erreur lors de la tentative de rejoindre la communauté",
        community.name,
      )
    }
  }

export const leaveFetchDataAction =
  (community: CommunityData, userId: UserData["_id"]) => async (dispatch) => {
    try {
      await dispatch(leaveCommunityAction(community._id, userId))
      await dispatch(getCommunityAction(community.name))
      //await dispatch(getNotJoinedCommunitiesAction()) TODO
      //await dispatch(getJoinedCommunitiesAction()) TODO
    } catch (error) {
      dispatch({
        type: types.LEAVE_COMMUNITY.FAIL,
        payload: "Error leaving community",
        meta: {
          requiresAuth: true,
        },
      })
      logger.error(
        "Erreur lors de la tentative de quitter la communauté",
        community.name,
      )
    }
  }

export const joinCommunityAction = createAsyncThunkAction<
  [CommunityData["_id"], UserData["_id"]],
  string
>(types.JOIN_COMMUNITY, api.joinCommunity)

export const leaveCommunityAction = createAsyncThunkAction<
  [CommunityData["_id"], UserData["_id"]],
  string
>(types.LEAVE_COMMUNITY, api.leaveCommunity)

export const getJoinedCommunitiesAction = createAsyncThunkAction<
  [],
  CommunityData[]
>(types.GET_JOINED_COMMUNITIES, api.getJoinedCommunities)

export const getNotJoinedCommunitiesAction = createAsyncThunkAction<
  [],
  CommunityData[]
>(types.GET_NOT_JOINED_COMMUNITIES, api.getNotJoinedCommunities)
