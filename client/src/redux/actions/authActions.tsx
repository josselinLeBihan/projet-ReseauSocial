import * as api from "../api/authAPI"
import * as types from "../constants/authConstants"
import { isValidToken } from "../utils/authUtils"
import { refreshTokenAction } from "./refreshTokenAction"
import { SignUpData, UserProfile, AuthData, UserData } from "../api/type"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { createAsyncThunkAction } from "../utils/reduxUtils"
import { logger } from "../../utils/logger"
import { getUserAction } from "./userActions"

type AppDispatch = ThunkDispatch<RootState, unknown, any>

export const initializeAuth = () => async (dispatch: AppDispatch) => {
  try {
    const profileData = localStorage.getItem("profile")
    logger.debug(
      "Initialisation de l'authentification avec les données du profil :",
      profileData,
    )

    if (!profileData) return

    const profile: UserProfile = JSON.parse(profileData)
    const { accessToken, refreshToken, user } = profile

    if (accessToken && refreshToken) {
      if (isValidToken(accessToken)) {
        logger.info("Le token d'accès est valide")
        dispatch(setAccessToken(accessToken))
        dispatch(setRefreshToken(refreshToken))
        dispatch(setUserData(user))
      } else {
        logger.info("Le token d'accès est invalide, rafraîchissement du token")
        await dispatch(refreshTokenAction(refreshToken))
      }
    }
  } catch (error) {
    logger.error(
      "Erreur lors de l'initialisation de l'authentification :",
      error,
    )
  }
}

export const setAccessToken =
  (accessToken: string) => async (dispatch: AppDispatch) => {
    logger.debug("Définition du token d'accès :", accessToken)
    dispatch({ type: types.SET_ACCESS_TOKEN, payload: accessToken })
  }

export const setRefreshToken =
  (refreshToken: string) => async (dispatch: AppDispatch) => {
    logger.debug("Définition du token de rafraîchissement :", refreshToken)
    dispatch({ type: types.SET_REFRESH_TOKEN, payload: refreshToken })
  }

export const setUserData =
  (userData: UserData) => async (dispatch: AppDispatch) => {
    logger.debug("Définition des données utilisateur :", userData)
    const userInfo = dispatch(getUserAction(userData._id))
    dispatch({ type: types.SET_USER_DATA, payload: userData })
    dispatch({ type: types.SET_USER_INFO, payload: userInfo })
  }

export const setInitialAuthState =
  (navigate: (path: string) => void) => async (dispatch: AppDispatch) => {
    logger.info(
      "Définition de l'état d'authentification initial et navigation vers /signin",
    )
    await dispatch({ type: types.LOGOUT })
    navigate("/signin")
  }

export const clearMessage = () => async (dispatch: AppDispatch) => {
  logger.debug("Effacement du message")
  dispatch({ type: types.CLEAR_MESSAGE })
}

export const logoutAction = () => async (dispatch: AppDispatch) => {
  try {
    logger.info("Déconnexion en cours")
    const { data } = await api.logout()
    localStorage.removeItem("profile")
    dispatch({ type: types.LOGOUT, payload: data })
  } catch (error) {
    logger.error("Erreur lors de la déconnexion :", error)
    dispatch({ type: types.LOGOUT, payload: types.ERROR_MESSAGE })
  }
}

export const signUpAction =
  (formData: SignUpData, navigate: (path: string) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      logger.info("Inscription avec les données du formulaire :", formData)
      const response = await createAsyncThunkAction<[SignUpData], string>(
        types.SIGNUP,
        api.signUp,
      )(formData)(dispatch)

      if (response && !response.error) {
        navigate("/signin")
        logger.info("Utilisateur inscrit avec succès")
      }
    } catch (error) {
      logger.error("Erreur lors de l'inscription :", error)
    }
  }

export const signInAction =
  (formData: AuthData, navigate: (path: string) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      logger.info("Connexion avec les données du formulaire :", formData)
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
        logger.info("Utilisateur connecté avec succès", user)
        return { success: true }
      } else {
        throw new Error("Données de réponse invalides")
      }
    } catch (error) {
      logger.error("Erreur lors de la connexion :", error)
    }
  }
