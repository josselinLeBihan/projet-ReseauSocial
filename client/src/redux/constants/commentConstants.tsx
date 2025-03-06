import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_COMMENT: ActionTypeProps = createConst("GET_COMMENT")
export const ADD_COMMENT: ActionTypeProps = createConst("ADD_COMMENT")
export const DELETE_COMMENT: ActionTypeProps = createConst("DELETE_COMMENT")
export const UPDATE_COMMENT: ActionTypeProps = createConst("UPDATE_COMMENT")
