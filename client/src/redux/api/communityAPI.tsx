import axios, { AxiosResponse } from "axios"
import { CommunityData, UserData } from "./type"
import { apiRequest } from "../utils/reduxUtils"
import logger from "../../utils/logger"

export const getCommunities = async (): Promise<{
  error?: string
  data?: CommunityData[]
}> => {
  return await apiRequest<CommunityData[]>("GET", `/community/communities`)
}

export const getCommunity = async (
  name: string,
): Promise<{ error?: string; data?: CommunityData }> => {
  return await apiRequest<CommunityData>("GET", `/community/${name}`)
}

export const joinCommunity = async (
  communityId: CommunityData["_id"],
  userId: UserData["_id"],
): Promise<{ error?: string; data?: string }> => {
  return await apiRequest<string>("POST", `/community/${communityId}/join`, {
    userId,
  })
}

export const leaveCommunity = async (
  communityId: CommunityData["_id"],
  userId: UserData["_id"],
): Promise<{ error?: string; data?: string }> => {
  return await apiRequest<string>("POST", `/community/${communityId}/leave`, {
    userId,
  })
}

export const getJoinedCommunities = async (): Promise<{
  error?: string
  data?: CommunityData[]
}> => {
  return await apiRequest<CommunityData[]>("POST", `/community/member`)
}

export const getNotJoinedCommunities = async (): Promise<{
  error?: string
  data?: CommunityData[]
}> => {
  return await apiRequest<CommunityData[]>("POST", `/community/notMember`)
}
