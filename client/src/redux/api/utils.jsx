import axios from "axios"

const BASE_URL = "http://localhost:3000"
//const BASE_URL = process.env.REACT_APP_API_URL

export const API = axios.create({
  baseURL: BASE_URL,
})

export const COMMUNITY_API = axios.create({
  baseURL: BASE_URL,
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
