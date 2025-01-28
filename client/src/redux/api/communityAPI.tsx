import { API, handleApiError } from "./utils"

export const getCommunities = async () => {
  try {
    const data = await API.get("/community/communities")
    return { error: null, data }
  } catch (error) {
    return handleApiError(error)
  }
}

export const getCommunity = async (name: string) => {
  try {
    const data = await API.get(`/community/${name}`)
    return { error: null, data }
  } catch (error) {
    return handleApiError(error)
  }
}
