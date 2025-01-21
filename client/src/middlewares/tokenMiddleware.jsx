import { jwtDecode } from "jwt-decode"

import { refreshTokenAction } from "../redux/actions/refreshTokenAction"

export const tokenMiddleware = (store) => (next) => async (action) => {
  if (action.meta && action.meta.requiresAuth) {
    const state = store.getState()
    const token = state.auth?.accessToken

    if (token) {
      // Décode le token et vérifie l'expiration
      const expiresIn = jwtDecode(token).exp * 1000 - Date.now()

      if (expiresIn < 1800000) {
        // Si le token expire dans moins de 30 minutes
        const refreshToken = state.auth.refreshToken
        try {
          await store.dispatch(refreshTokenAction(refreshToken)) // Rafraîchit le token
          const newToken = store.getState().auth.accessToken

          if (!newToken) {
            throw new Error("Access token not found after refresh")
          }
        } catch (error) {
          store.dispatch({ type: "LOGOUT" }) // Déconnecte l'utilisateur en cas d'échec
        }
      }
    } else {
      store.dispatch({ type: "LOGOUT" }) // Déconnecte l'utilisateur si aucun token
    }
  }

  return next(action) // Passe à l'action suivante
}
