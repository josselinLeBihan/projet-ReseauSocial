import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { act, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import CommunityHome from "../CommunityHome"
import rootReducer from "../../redux/reducers"
import { UserData, CommunityData } from "../../redux/api/type"
import * as types from "../../redux/constants/communityConstants"
import React from "react"
import CommunityPresentation from "../../Components/Community/CommunityMainSection"

// Mock des sous-composants
vi.mock("../../Components/Community/CommunityMainSection", () => ({
  __esModule: true,
  default: () => <div>Mocked CommunityMainSection</div>,
}))

vi.mock("../../Components/Community/CommunityPresentation", () => ({
  __esModule: true,
  default: () => <div>Mocked CommunityPresentation</div>,
}))

// Mock de useParams pour simuler la récupération du nom de la communauté
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: () => ({ communityName: "ReactCommunity" }),
  }
})

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

const mockCommunity: CommunityData = {
  _id: "community123",
  name: "ReactCommunity",
  description: "Un groupe de passionnés de React",
  members: [],
  image: "react.png",
}

describe("CommunityHome Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Affiche CommunityPresentation si aucune communauté n'est chargée", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/community/ReactCommunity"]}>
          <Routes>
            <Route
              path="/community/:communityName"
              element={<CommunityHome />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("Mocked CommunityPresentation")).toBeInTheDocument()
  })

  it("Affiche CommunityMainSection si une communauté est chargée", async () => {
    await act(async () => {
      store.dispatch({
        type: types.GET_COMMUNITY.SUCCESS,
        payload: mockCommunity,
      })
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/community/ReactCommunity"]}>
          <Routes>
            <Route
              path="/community/:communityName"
              element={<CommunityHome />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("Mocked CommunityMainSection")).toBeInTheDocument()
  })
})
