import axios from "axios"
import * as types from "../constants/authConstants"

const API = axios.create({
  //baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
})

API.interceptors.request.use((req) => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`
  }
  return req
})

export const refreshTokenAction = (refreshToken) => async (dispatch) => {
  try {
    const response = await API.post("/users/refresh-token", {
      refreshToken,
    })
    const profile = JSON.parse(localStorage.getItem("profile"))
    const payload = response.data
    localStorage.setItem("profile", JSON.stringify({ ...profile, ...payload }))
    dispatch({
      type: types.REFRESH_TOKEN.SUCESS,
      payload: payload,
    })
  } catch (error) {
    localStorage.removeItem("profile")
    dispatch({
      type: types.REFRESH_TOKEN.FAIL,
      payload: error.response.data,
    })
  }
}
