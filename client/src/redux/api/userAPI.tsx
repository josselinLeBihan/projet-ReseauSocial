import { apiRequest } from "../utils/reduxUtils"
import { UserData, UserInfo } from "./type"

/*
export const getUser = async (id: string) => {
  try {
    const { data } = await API.get(`/user/${id}`)
    return { error: null, data }
  } catch (error) {
    return handleApiError(error)
  }
}
*/
export const getUser = async (
  id: UserInfo["_id"],
): Promise<{
  error?: string
  data?: UserInfo
}> => {
  return await apiRequest<UserInfo>("GET", `/user/${id}`)
}
