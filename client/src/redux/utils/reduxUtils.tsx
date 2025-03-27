import { Dispatch } from "redux"
import { API } from "../api/utils"
import { logger } from "../../utils/logger"

export interface ActionTypeProps {
  REQUEST: string
  SUCCESS: string
  FAIL: string
}

// Fonction générique qui crée une action asynchrone Redux
/**
 * @TARGs le type d'arguments pour l'API
 * @TResponse le type attendu de la réponse
 * @param actionTypes Constantes de l'action
 * @param asyncFunction API correspondant à l'action
 * @returns
 */

export const createAsyncThunkAction = <TArgs extends any[], TResponse>(
  actionTypes: ActionTypeProps,
  asyncFunction: (
    ...args: TArgs
  ) => Promise<{ error?: string; data?: TResponse }>,
) => {
  return (...args: TArgs) =>
    async (dispatch: Dispatch) => {
      dispatch({ type: actionTypes.REQUEST })
      await logger.info(`Action ${actionTypes.REQUEST} déclenchée avec`, args)

      try {
        const { error, data } = await asyncFunction(...args)

        if (error) {
          throw new Error(error)
        }

        await logger.debug(`Action ${actionTypes.SUCCESS} réussie`, data)
        dispatch({ type: actionTypes.SUCCESS, payload: data })

        return { error, data }
      } catch (error: any) {
        await logger.error(
          `Erreur dans l'action ${actionTypes.REQUEST}`,
          error.message,
        )

        dispatch({
          type: actionTypes.FAIL,
          payload: error.message || "Une erreur s'est produite.",
        })
      }
    }
}

//fonction générique qui crée les constantes
export const createConst = (constantName: string): ActionTypeProps => {
  return {
    REQUEST: `${constantName}_REQUEST`,
    SUCCESS: `${constantName}_SUCCESS`,
    FAIL: `${constantName}_FAIL`,
  }
}

interface ApiResponse<T> {
  error?: string
  data?: T
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

//Fonction généique qui gère les API
export const apiRequest = async <T extends any>(
  method: HttpMethod,
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> => {
  await logger.debug(
    `Requête ${method} ${endpoint} ${body && "déclenchée avec"}`,
    body || "",
  )

  try {
    let response

    switch (method) {
      case "GET":
        response = await API.get<T>(endpoint)
        break
      case "POST":
        response = await API.post<T>(endpoint, body)
        break
      case "PATCH":
        response = await API.patch<T>(endpoint, body)
        break
      case "PUT":
        response = await API.put<T>(endpoint, body)
        break
      case "DELETE":
        response = await API.delete<T>(endpoint)
        break
      default:
        throw new Error("Méthode HTTP non supportée")
    }
    await logger.debug(`Réponse de l'API pour ${method} ${endpoint}`, response)
    return { data: response.data }
  } catch (error: any) {
    return { error: error.response.data.error || "Une erreur est survenue" }
  }
}
