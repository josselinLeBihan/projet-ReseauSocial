import { describe, expect, it, vi, beforeEach } from "vitest"
import { createAsyncThunkAction, createConst, apiRequest } from "../reduxUtils"

import { API } from "../../api/utils"

vi.mock("../../utils/logger", () => ({
  info: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
}))

describe("asyncActions utils", () => {
  let dispatch: vi.Mock

  beforeEach(() => {
    dispatch = vi.fn()

    // 🔥 Utilisation de vi.spyOn pour mocker les fonctions de API
    vi.spyOn(API, "get").mockResolvedValue({
      data: { message: "Réussite GET" },
    })
    vi.spyOn(API, "post").mockResolvedValue({
      data: { message: "Réussite POST" },
    })
    vi.spyOn(API, "delete").mockResolvedValue({
      data: { message: "Réussite DELETE" },
    })
  })

  it("createConst génère correctement les constantes", () => {
    const constants = createConst("TEST")

    expect(constants).toEqual({
      REQUEST: "TEST_REQUEST",
      SUCCESS: "TEST_SUCCESS",
      FAIL: "TEST_FAIL",
    })
  })

  it("createAsyncThunkAction déclenche une action REQUEST et SUCCESS en cas de succès", async () => {
    const actionTypes = createConst("TEST")
    const mockApiFunction = vi.fn(() =>
      Promise.resolve({ data: "Réponse API" }),
    )

    const thunk = createAsyncThunkAction(actionTypes, mockApiFunction)
    await thunk("arg1", "arg2")(dispatch)

    expect(dispatch).toHaveBeenCalledWith({ type: actionTypes.REQUEST })
    expect(mockApiFunction).toHaveBeenCalledWith("arg1", "arg2")
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.SUCCESS,
      payload: "Réponse API",
    })
  })

  it("createAsyncThunkAction déclenche une action FAIL en cas d'erreur", async () => {
    const actionTypes = createConst("TEST")
    const mockApiFunction = vi.fn(() =>
      Promise.resolve({ error: "Erreur API" }),
    )

    const thunk = createAsyncThunkAction(actionTypes, mockApiFunction)
    await thunk("arg1", "arg2")(dispatch)

    expect(dispatch).toHaveBeenCalledWith({ type: actionTypes.REQUEST })
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.FAIL,
      payload: "Erreur API",
    })
  })

  it("apiRequest gère les requêtes GET", async () => {
    API.get.mockResolvedValue({ data: { message: "Réussite GET" } })

    const response = await apiRequest("GET", "/test-endpoint")

    expect(API.get).toHaveBeenCalledWith("/test-endpoint")
    expect(response).toEqual({ data: { message: "Réussite GET" } })
  })

  it("apiRequest gère les requêtes POST", async () => {
    API.post.mockResolvedValue({ data: { message: "Réussite POST" } })

    const response = await apiRequest("POST", "/test-endpoint", {
      key: "value",
    })

    expect(API.post).toHaveBeenCalledWith("/test-endpoint", { key: "value" })
    expect(response).toEqual({ data: { message: "Réussite POST" } })
  })

  it("apiRequest gère les requêtes DELETE", async () => {
    API.delete.mockResolvedValue({ data: { message: "Réussite DELETE" } })

    const response = await apiRequest("DELETE", "/test-endpoint")

    expect(API.delete).toHaveBeenCalledWith("/test-endpoint")
    expect(response).toEqual({ data: { message: "Réussite DELETE" } })
  })

  it("apiRequest gère les erreurs API", async () => {
    API.get.mockRejectedValue({ response: { data: { message: "Erreur GET" } } })

    const response = await apiRequest("GET", "/test-endpoint")

    expect(response).toEqual({ error: "Erreur GET" })
  })
})
