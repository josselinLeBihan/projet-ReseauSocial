import { API } from "./utils"
import { SignUpData, UserProfile } from "./type"
import { AuthData } from "./type"
import { apiRequest } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

export const signIn = async (
  data: AuthData,
): Promise<{ error?: string; data?: UserProfile }> => {
  try {
    const res = await API.post("/auth/signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    logger.warn("Res", res)

    if (res && res.data) {
      return { error: "", data: res.data }
    } else {
      return { error: "No data received from server", data: undefined }
    }
  } catch (error) {
    logger.warn("Error", error)

    return { error: error.response.data.error }
  }
}

export const signUp = async (
  data: FormData,
): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/auth/signup`, data)
}

export const logout = async (): Promise<{
  error?: string
  data?: string
}> => {
  return await apiRequest<string>("POST", `/auth/logout`, {
    Headers: { "Content-Type": "application/json" },
  })
}
