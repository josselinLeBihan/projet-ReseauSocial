import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_USER: ActionTypeProps = createConst("GET_USER")
export const GET_PROFILE: ActionTypeProps = createConst("GET_PROFILE")
export const CHANGE_FOLLOW_STATUS: ActionTypeProps = createConst(
  "CHANGE_FOLLOW_STATUS",
)
export const GET_FOLLOWING_USERS: ActionTypeProps = createConst(
  "GET_FOLLOWING_USERS",
)
