import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_POSTS: ActionTypeProps = createConst("GET_POSTS")
export const ADD_POST: ActionTypeProps = createConst("ADD_POST")
export const DELETE_POST: ActionTypeProps = createConst("DELETE_POST")
export const UPDATE_POST: ActionTypeProps = createConst("UPDATE_POST")
export const GET_POST: ActionTypeProps = createConst("GET_POST")
