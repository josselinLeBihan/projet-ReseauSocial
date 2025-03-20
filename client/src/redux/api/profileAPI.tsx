import { logger } from "../../utils/logger"
import { apiRequest } from "../utils/reduxUtils"
import { PublicUserInfo, UserData, UserInfo } from "./type"

export const getProfile = async (
  userId: UserInfo["_id"],
  currentUserId: UserData["_id"],
): Promise<{
  error?: string
  data?: PublicUserInfo
}> => {
  return await apiRequest<PublicUserInfo>("GET", `/profile/${userId}`, {
    currentUserId,
  })
}

export const followUser = async (
  followedId: UserData["_id"],
): Promise<{ error?: string; data?: PublicUserInfo }> => {
  return await apiRequest<PublicUserInfo>(
    "PATCH",
    `/profile/${followedId}/follow`,
  )
}

export const unfollowUser = async (
  followedId: UserInfo["_id"],
): Promise<{
  error?: string
  data?: PublicUserInfo
}> => {
  return await apiRequest<PublicUserInfo>(
    "PATCH",
    `profile/${followedId}/unfollow`,
  )
}
