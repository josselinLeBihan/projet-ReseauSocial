import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URL

export const API = axios.create({
  baseUrl: BASE_URL,
})

export const COMMUNITY_API = axios.create({
  baseUrl: BASE_URL,
})

const authInterceptor = (req) => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`
  }
  return req
}

API.interceptors.request.use(authInterceptor)
COMMUNITY_API.interceptors.request.use((req) => {
  req.headers["Content-Type"] = "application/json"
  return authInterceptor(req)
})

export const handleApiError = async (error) => {
  try {
    const errorMessage =
      error.response?.data?.message || "Une erreur inattendue est survenue."
    const data = null
    return { error: errorMessage, data }
  } catch (err) {
    throw new Error("Une erreur inattendue est survenue.")
  }
}
