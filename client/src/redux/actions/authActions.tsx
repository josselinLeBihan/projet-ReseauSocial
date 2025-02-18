import * as api from "../api/authAPI"
import * as types from "../constants/authConstants"
import { isValidToken } from "../utils/authUtils"
import { refreshTokenAction } from "./refreshTokenAction"
import { SignUpData, UserProfile } from "../api/type"
import { AuthData } from "../api/type"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"

type AppDispatch = ThunkDispatch<RootState, unknown, any>

export const initializeAuth = () => async (dispatch: AppDispatch) => {
  try {
    const profileData = localStorage.getItem("profile")

    if (!profileData) return

    const profile: UserProfile = JSON.parse(profileData)

    const { accessToken, refreshToken, user } = profile

    if (accessToken && refreshToken) {
      if (isValidToken(accessToken)) {
        dispatch(setAccessToken(accessToken))
        dispatch(setRefreshToken(refreshToken))
        dispatch(setUserData(user))
      } else {
        await dispatch(refreshTokenAction(refreshToken))
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de l'authentification :",
      error,
    )
  }
}

export const setAccessToken = (accessToken) => async (dispatch) => {
  dispatch({ type: types.SET_ACCESS_TOKEN, payload: accessToken })
}

export const setRefreshToken = (refreshToken) => async (dispatch) => {
  dispatch({ type: types.SET_REFRESH_TOKEN, payload: refreshToken })
}

export const setUserData = (userData) => async (dispatch) => {
  dispatch({ type: types.SET_USER_DATA, payload: userData })
}

export const setInitialAuthState = (navigate) => async (dispatch) => {
  await dispatch({ type: types.LOGOUT })
  navigate("/signin")
}

export const clearMessage = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_MESSAGE })
}

export const logoutAction = () => async (dispatch) => {
  try {
    const { data } = await api.logout()
    localStorage.removeItem("profile")
    dispatch({ type: types.LOGOUT, payload: data })
  } catch (error) {
    dispatch({ type: types.LOGOUT, payload: types.ERROR_MESSAGE })
  }
}

export const signUpAction =
  (formData: SignUpData, navigate) => async (dispatch: AppDispatch) => {
    try {
      const response = await createAsyncThunkAction<[SignUpData], string>(
        types.SIGNUP,
        api.signUp,
      )(formData)(dispatch)

      if (response && !response.error) {
        navigate("/signin")
        logger.info("User signed up successfully")
      }
    } catch (error) {
      logger.error("Error in signUpAction", error)
    }
  }

export const signInAction =
  (formData: AuthData, navigate) => async (dispatch: AppDispatch) => {
    try {
      const response = await createAsyncThunkAction<[AuthData], UserProfile>(
        types.SIGNIN,
        api.signIn,
      )(formData)(dispatch)

      if (response?.error) {
        throw Error(response.error)
      }

      if (response?.data) {
        const { user, accessToken, refreshToken, accessTokenUpdatedAt } =
          response.data
        const profile = {
          user,
          accessToken,
          refreshToken,
          accessTokenUpdatedAt,
        }

        localStorage.setItem("profile", JSON.stringify(profile))
        navigate("/")
        logger.info("User signed in successfully", user)
        return { success: true }
      } else {
        throw new Error("Invalid response data")
      }
    } catch (error) {
      logger.error("Error in signInAction", error)
    }
  }
