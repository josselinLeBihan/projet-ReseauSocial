import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import rootReducer from "../../../redux/reducers/index" // Assure-toi du bon chemin
import CommunityAbout from "../CommunityAbout"
import { CommunityData, PostData } from "../../../redux/api/type"
import * as types from "../../../redux/constants/communityConstants"

const mockCommunity: CommunityData = {
  _id: "community123",
  name: "TestCommunity",
  members: [],
  image: "https://via.placeholder.com/150",
  description: "description",
}

describe("CommunityForum", () => {
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
        post: {
          posts: [],
          error: null,
          post: null,
          successMessage: null,
        },
      },
    })
  })

  it("Affiche la description de la communauté", async () => {
    await act(async () => {
      await store.dispatch({
        type: types.GET_COMMUNITY.SUCCESS,
        payload: {
          ...mockCommunity,
        },
      })
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommunityAbout />
        </MemoryRouter>
      </Provider>,
    )

    expect(await screen.findByText(/description/)).toBeInTheDocument()
  })
})
