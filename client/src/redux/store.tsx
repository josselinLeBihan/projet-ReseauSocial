import { configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import rootReducer from "./reducers"
import { tokenMiddleware } from "../middlewares/tokenMiddleware"
import { initializeAuth } from "./actions/authActions"
import {
  TypedUseSelectorHook,
  useDispatch,
  UseDispatch,
  useSelector,
} from "react-redux"
import { logger } from "../utils/logger"

export type RootState = ReturnType<typeof rootReducer>

const createAppStore = async () => {
  try {
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk, tokenMiddleware),
    })

    await store.dispatch(initializeAuth())

    return store
  } catch (err) {
    logger.error("Error creating store", err)
    throw new Error("Some error occurred")
  }
}

export type AppDispatch =
  ReturnType<typeof createAppStore> extends Promise<infer S>
    ? S extends { dispatch: infer D }
      ? D
      : never
    : never

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default createAppStore
