import { configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import rootReducer from "./reducers"
import { tokenMiddleware } from "../middlewares/tokenMiddleware"
import { initializeAuth } from "./actions/authActions"

const createAppStore = async () => {
  try {
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk, tokenMiddleware), // Ajouter vos middlewares supplémentaires
    })

    await store.dispatch(initializeAuth())

    return store
  } catch (err) {
    throw new Error("Some error occurred")
  }
}

export default createAppStore
