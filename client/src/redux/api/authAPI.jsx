import { API, handleApiError } from "./utils"

export const signIn = async (data) => {
  try {
    const res = await API.post("/api/auth/signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res && res.data) {
      return { error: null, data: res.data }
    } else {
      return { error: "No data received from server", data: null }
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export const signUp = async (data) => {
  try {
    const res = await API.post("/api/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res && res.data) {
      return { error: null, data: res.data }
    } else {
      return { error: "No data received from server", data: null }
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export const logout = async () => {
  try {
    const res = await API.post("/api/auth/logout", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return { error: null, data: res.data }
  } catch (error) {
    return handleApiError(error)
  }
}
