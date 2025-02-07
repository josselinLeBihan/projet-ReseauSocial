import { apiRequest } from "../utils/reduxUtils"
import { UserData } from "./type"

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
  id: UserData["_id"],
): Promise<{
  error?: string
  data?: UserData
}> => {
  return await apiRequest<UserData>("GET", `/user/${id}`)
}
