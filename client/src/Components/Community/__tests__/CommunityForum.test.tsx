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
import * as typesCommunity from "../../../redux/constants/communityConstants"
import * as typesPost from "../../../redux/constants/postConstants"
import { getComPostsAction } from "../../../redux/actions/postAction"

vi.mock("../../../redux/actions/postAction", () => ({
  getComPostsAction: vi.fn(() => async () => ({
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
    })
  })

  it("Dispatch getComPostsAction puis affiche les posts fournit", async () => {
    await act(async () => {
      await store.dispatch({
        type: typesCommunity.GET_COMMUNITY.SUCCESS,
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

    expect(getComPostsAction).toHaveBeenCalledTimes(1)
    expect(getComPostsAction).toHaveBeenCalledWith(mockCommunity._id, 5, 0)

    await act(async () => {
      await store.dispatch({
        type: typesPost.GET_COM_POSTS.SUCCESS,
        payload: {
          page: 1,
          posts: [mockPost1, mockPost2],
          totalCommunityPosts: 2,
        },
      })
    })

    expect(await screen.findByText(/post123/)).toBeInTheDocument()
    expect(await screen.findByText(/post456/)).toBeInTheDocument()
  })
})
