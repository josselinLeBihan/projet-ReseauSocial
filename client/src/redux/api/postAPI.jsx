import { API, handleApiError } from "./utils"

export const addPost = async (post) => {
  try {
    const response = await API.post("/posts", post)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getPosts = async () => {
  try {
    const response = await API.get("/posts")
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
