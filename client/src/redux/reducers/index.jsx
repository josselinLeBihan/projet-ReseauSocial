import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "./authReducers"
import communityReducer from "./communittyReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
})

export default rootReducer
