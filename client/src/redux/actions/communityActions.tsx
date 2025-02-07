import { data } from "react-router-dom"
import * as api from "../api/communityAPI"
import * as types from "../constants/communityConstants"
import { CommunityData } from "../api/type"
import { createAsyncThunkAction } from "../utils/reduxUtils"

export const getCommunitiesAction = createAsyncThunkAction<[], CommunityData[]>(
  types.GET_COMMUNITIES,
  api.getCommunities,
)

export const getCommunityAction = createAsyncThunkAction<
  [string],
  CommunityData
>(types.GET_COMMUNITY, api.getCommunity)

export const joinCommunityAction = createAsyncThunkAction<
  [CommunityData["_id"]],
  string
>(types.JOIN_COMMUNITY, api.joinCommunity)

export const leaveCommunityAction = createAsyncThunkAction<
  [CommunityData["_id"]],
  string
>(types.LEAVE_COMMUNITY, api.leaveCommunity)

export const getJoinedCommunity = createAsyncThunkAction<[], CommunityData[]>(
  types.GET_JOINED_COMMUNITIES,
  api.getJoinedCommunity,
)

export const getNotJoinedCommunity = createAsyncThunkAction<
  [],
  CommunityData[]
>(types.GET_NOT_JOINED_COMMUNITIES, api.getNotJoinedCommunity)
