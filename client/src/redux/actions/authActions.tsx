import * as api from "../api/authAPI"
import * as types from "../constants/authConstants"
import { isValidToken } from "../utils/authUtils"
import { refreshTokenAction } from "./refreshTokenAction"
import { SignUpData } from "../api/type"
import { AuthData } from "../api/type"

export const initializeAuth = () => async (dispatch) => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken
  const refreshToken = JSON.parse(localStorage.getItem("profile"))?.refreshToken

  if (accessToken && refreshToken) {
    if (isValidToken(accessToken)) {
      dispatch(setAccessToken(accessToken))
      dispatch(setRefreshToken(refreshToken))
      dispatch(setUserData(JSON.parse(localStorage.getItem("profile")).user))
    } else {
      await dispatch(refreshTokenAction(refreshToken))
    }
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
  (formData: SignUpData, navigate) => async (dispatch) => {
    try {
      localStorage.removeItem("profile")
      const response = await api.signUp(formData)
      const { error } = response
      if (error) {
        console.log("action: " + error)
        dispatch({
          type: types.SIGNUP_FAIL,
          payload: error,
        })
        return {
          success: false,
          message: error.message || "Une erreur s'est produite.",
        }
      } else {
        dispatch({
          type: types.SIGNUP_SUCCESS,
          payload: types.SIGNUP_SUCCESS_MESSAGE,
        })
        navigate("/signin")
      }
    } catch (error) {
      console.log("action: " + error.message)
      dispatch({
        type: types.SIGNUP_FAIL,
        payload: error.message || "Une erreur s'est produite.",
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    }
  }

export const signInAction =
  (formData: AuthData, navigate) => async (dispatch) => {
    try {
      const response = await api.signIn(formData)
      const { error, data } = response

      // En cas d'erreur retournée par l'API
      if (error) {
        dispatch({
          type: types.SIGNIN_FAIL,
          payload: error, // Contient le message d'erreur retourné par l'API
        })
        return { success: false, message: error } // Assurez-vous de retourner `success: false`
      }

      // En cas de succès
      const { user, accessToken, refreshToken, accessTokenUpdatedAt } = data
      const profile = {
        user,
        accessToken,
        refreshToken,
        accessTokenUpdatedAt,
      }

      // Stocker les données utilisateur dans le localStorage
      localStorage.setItem("profile", JSON.stringify(profile))

      // Dispatch du succès
      dispatch({
        type: types.SIGNIN_SUCCESS,
        payload: profile,
      })

      // Navigation
      navigate("/")
      return { success: true } // Succès
    } catch (error) {
      // En cas d'erreur inattendue
      console.error("Erreur dans signInAction :", error)
      dispatch({
        type: types.SIGNIN_FAIL,
        payload: error.message || "Une erreur s'est produite.",
      })
      return {
        success: false,
        message: error.message || "Une erreur s'est produite.",
      }
    }
  }
