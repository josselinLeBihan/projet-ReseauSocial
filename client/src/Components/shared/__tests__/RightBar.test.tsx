import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter, useNavigate } from "react-router-dom"
import { describe, expect, it, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import RightBar from "../RightBar"
import rootReducer from "../../../redux/reducers/index"
import { UserData, CommunityData } from "../../../redux/api/type"
import * as types from "../../../redux/constants/communityConstants"
import {
  getCommunitiesAction,
  getCommunityAction,
} from "../../../redux/actions/communityActions"

vi.mock("../../../redux/actions/communityActions", () => ({
  getCommunitiesAction: vi.fn(() => async () => {}),
  getCommunityAction: vi.fn(() => async () => {}),
}))

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

const mockCommunities: CommunityData[] = [
  {
    _id: "community123",
    name: "React Community",
    description: "Un groupe de passionnés de React",
    members: [],
    image: "react.png",
  },
  {
    _id: "community456",
    name: "VueJS Community",
    description: "Un groupe de passionnés de VueJS",
    members: [],
    image: "vue.png",
  },
]

describe("RightBar Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Appelle getCommunitiesAction au montage", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/community"]}>
          <RightBar />
        </MemoryRouter>
      </Provider>,
    )

    expect(getCommunitiesAction).toHaveBeenCalledTimes(1)
  })

  it("Affiche les communautés si elles existent", async () => {
    await act(async () => {
      store.dispatch({
        type: types.GET_COMMUNITIES.SUCCESS,
        payload: mockCommunities,
      })
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/community"]}>
          <RightBar userData={mockUser} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("React Community")).toBeInTheDocument()
    expect(screen.getByText("VueJS Community")).toBeInTheDocument()
  })

  it("Affiche 'Aucune communauté trouvée.' si aucune communauté n'est disponible", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/community"]}>
          <RightBar userData={mockUser} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("Aucune communauté trouvée.")).toBeInTheDocument()
  })
})
