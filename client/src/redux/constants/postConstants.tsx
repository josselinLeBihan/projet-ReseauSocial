import { ActionTypeProps, createConst } from "../utils/reduxUtils"

export const GET_POSTS: ActionTypeProps = createConst("GET_POSTS")
export const GET_COM_POSTS: ActionTypeProps = createConst("GET_COM_POSTS")
export const ADD_POST: ActionTypeProps = createConst("ADD_POST")
export const DELETE_POST: ActionTypeProps = createConst("DELETE_POST")
export const UPDATE_POST: ActionTypeProps = createConst("UPDATE_POST")
export const GET_POST: ActionTypeProps = createConst("GET_POST")
export const LIKE_POST: ActionTypeProps = createConst("LIKE_POST")
export const UNLIKE_POST: ActionTypeProps = createConst("UNLIKE_POST")
