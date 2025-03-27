import { apiRequest } from "../utils/reduxUtils"
import { ActualUserInfo, PublicUserInfo, UserData, UserInfo } from "./type"

export const getUser = async (
  id: UserInfo["_id"],
): Promise<{
  error?: string
  data?: ActualUserInfo
}> => {
  return await apiRequest<ActualUserInfo>("GET", `/user/${id}`)
}

export const updateUser = async (
  id: UserInfo["_id"],
  data: FormData,
): Promise<{
  error?: string
}> => {
  return await apiRequest("PUT", `/user/${id}`, data)
}
