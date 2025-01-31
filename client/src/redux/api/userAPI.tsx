import { API, handleApiError } from "./utils"

export const getUser = async (id: string) => {
  try {
    const { data } = await API.get(`/user/${id}`)
    return { error: null, data }
  } catch (error) {
    return handleApiError(error)
  }
}
