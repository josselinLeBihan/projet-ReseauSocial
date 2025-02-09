import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "./authReducers"
import communityReducer from "./communityReducer"
import commentReducer from "./commentReducer"
import postReducer from "./postReducer"
import userReducer from "./userReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
  comment: commentReducer,
  post: postReducer,
  user: userReducer,
})

export default rootReducer
