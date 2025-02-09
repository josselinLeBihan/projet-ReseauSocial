import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import rootReducer from "../../../redux/reducers/index" // Assure-toi du bon chemin
import CommunityMainSection from "../CommunityMainSection"
import { CommunityData, UserData } from "../../../redux/api/type"
import { joinCommunityAndFetchDataAction } from "../../../redux/actions/communityActions"
import logger from "../../../utils/logger"

vi.mock("../../../redux/actions/communityActions", () => ({
  joinCommunityAndFetchDataAction: vi.fn(() => async () => {}),
  leaveFetchDataAction: vi.fn(() => async () => {}),
}))

vi.mock("../../../redux/actions/userActions", () => ({
  getUserAction: vi.fn(() => async () => {}),
}))

const mockCommunity: CommunityData = {
  _id: "community123",
  name: "TestCommunity",
  members: [],
  image: "https://via.placeholder.com/150",
  description: "description",
}
const mockUser: UserData = {
  _id: "user123",
  name: "user",
  userName: "user",
  email: "user@mail.com",
  password: "A:12345",
}

describe("CommunityMainSection", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        community: {
          communities: [],
          error: null,
          community: null,
          joinedCommunities: [],
          notJoinedCommunities: [],
        },
      },
    })
  })

  it("Affiche le nom de la communauté et un bouton 'Rejoindre' si l'utilisateur n'est pas membre", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommunityMainSection community={mockCommunity} userData={mockUser} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("TestCommunity")).toBeInTheDocument()
    expect(screen.getByText("Rejoindre")).toBeInTheDocument()
  })

  it("Dispatch de joinCommunityAndFetchDataAction lorsque l'utilisateur clique sur 'Rejoindre'", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommunityMainSection community={mockCommunity} userData={mockUser} />
        </MemoryRouter>
      </Provider>,
    )

    const joinButton = screen.getByRole("button", { name: /Rejoindre/i })

    await act(async () => {
      fireEvent.click(joinButton)
    })

    expect(joinCommunityAndFetchDataAction).toHaveBeenCalledTimes(1)
    expect(joinCommunityAndFetchDataAction).toHaveBeenCalledWith(
      mockCommunity,
      mockUser._id,
    )
  })

  it("affiche une erreur dans logger.error si l'adhésion échoue", async () => {
    vi.spyOn(logger, "error").mockImplementation(() => {})

    vi.mock("../../../redux/actions/communityActions", () => ({
      joinCommunityAndFetchDataAction: vi.fn(() => async () => {
        throw new Error("Échec de l'adhésion")
      }),
    }))

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommunityMainSection community={mockCommunity} userData={mockUser} />
        </MemoryRouter>
      </Provider>,
    )

    const joinButton = screen.getByRole("button", { name: /Rejoindre/i })

    await act(async () => {
      fireEvent.click(joinButton)
    })

    expect(logger.error).toHaveBeenCalledWith(
      "Une erreur est survenue lors du changement d'adhesion à la communauté",
      expect.any(Error),
    )
  })
})
