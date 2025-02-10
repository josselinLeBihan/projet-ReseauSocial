import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import rootReducer from "../../../redux/reducers/index" // Assure-toi du bon chemin
import CommunityForum from "../CommunityForum"
import { CommunityData, PostData } from "../../../redux/api/type"
import * as types from "../../../redux/constants/communityConstants"
import { getPostsAction } from "../../../redux/actions/postAction"

vi.mock("../../../redux/actions/postAction", () => ({
  getPostsAction: vi.fn(() => async () => ({
    data: [mockPost1, mockPost2],
  })),
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

const mockPost1: PostData = {
  _id: "post123",
  createdAt: "date",
  comments: [],
  user: "user123",
  community: "community123",
  content: "post123",
}
const mockPost2: PostData = {
  _id: "post456",
  createdAt: "date",
  comments: [],
  user: "user123",
  community: "community123",
  content: "post456",
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

  it("Dispatch getPostsAction puis affiche les posts fournit", async () => {
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
          <CommunityForum />
        </MemoryRouter>
      </Provider>,
    )

    expect(getPostsAction).toHaveBeenCalledTimes(1)
    expect(getPostsAction).toHaveBeenCalledWith(mockCommunity._id)

    expect(await screen.findByText(/post123/)).toBeInTheDocument()
    expect(await screen.findByText(/post456/)).toBeInTheDocument()
  })
})
