import { API, handleApiError } from "./utils"
import { SignUpData } from "./type"
import { AuthData } from "./type"

export const signIn = async (data: AuthData) => {
  try {
    const res = await API.post("/auth/signin", data, {
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

export const signUp = async (data: SignUpData) => {
  try {
    const res = await API.post("/auth/signup", data, {
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
    const res = await API.post("/auth/logout", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return { error: null, data: res.data }
  } catch (error) {
    return handleApiError(error)
  }
}
