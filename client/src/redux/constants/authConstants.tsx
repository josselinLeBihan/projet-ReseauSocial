import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const SIGNUP: ActionTypeProps = createConst("SIGNUP")
export const SIGNIN: ActionTypeProps = createConst("SIGNIN")
export const LOGOUT = "LOGOUT"

export const REFRESH_TOKEN: ActionTypeProps = createConst("REFRESH_TOKEN")

export const GET_USER_PREFERENCES: ActionTypeProps = createConst(
  "GET_USER_PREFERENCES",
)

export const ERROR_MESSAGE = "Quelque chose s'est mal passé."
export const SIGNUP_SUCCESS_MESSAGE =
  "Vous avez été inscrit avec succès. Veuillez vous connecter."

export const CLEAR_MESSAGE = "CLEAR_MESSAGE"

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"

export const SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN"

export const SET_USER_DATA = "SET_USER_DATA"
