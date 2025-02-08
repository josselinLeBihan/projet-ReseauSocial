import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "./authReducers"
import communityReducer from "./communityReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
})

export default rootReducer
