import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_COMMENT: ActionTypeProps = createConst("GET_COMMENT")
export const ADD_COMMENT: ActionTypeProps = createConst("ADD_COMMENT")
export const DELETE_COMMENT: ActionTypeProps = createConst("DELETE_COMMENT")
export const UPDATE_COMMENT: ActionTypeProps = createConst("UPDATE_COMMENT")
export const LIKE_COMMENT: ActionTypeProps = createConst("LIKE_COMMENT")
export const UNLIKE_COMMENT: ActionTypeProps = createConst("UNLIKE_COMMENT")
