import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_COMMUNITY: ActionTypeProps = createConst("GET_COMMUNITY")
export const GET_COMMUNITIES: ActionTypeProps = createConst("GET_COMMUNITIES")
export const GET_JOINED_COMMUNITIES: ActionTypeProps = createConst(
  "GET_JOINED_COMMUNITIES",
)
export const GET_NOT_JOINED_COMMUNITIES: ActionTypeProps = createConst(
  "GET_NOT_JOINED_COMMUNITIES",
)
export const JOIN_COMMUNITY: ActionTypeProps = createConst("JOIN_COMMUNITY")
export const LEAVE_COMMUNITY: ActionTypeProps = createConst("LEAVE_COMMUNITY")
export const GET_COMMUNITY_MEMBERS: ActionTypeProps = createConst(
  "GET_COMMUNITY_MEMBERS",
)
