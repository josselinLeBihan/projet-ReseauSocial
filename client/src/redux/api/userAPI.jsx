import { API, handleApiError } from "./utils"

export const getUser = async (id) => {
  try {
    const { data } = await API.get(`/user/getuser${id}`)
    return { error: null, data }
  } catch (error) {
    return handleApiError(error)
  }
}
