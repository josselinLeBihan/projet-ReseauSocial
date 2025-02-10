import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import rootReducer from "../../../redux/reducers/index"
import Comment from "../Comment"
import { CommentData, UserData } from "../../../redux/api/type"
import logger from "../../../utils/logger"
import { getCommentAction } from "../../../redux/actions/commentAction"

vi.mock("../../../redux/actions/commentAction", () => ({
  getCommentAction: vi.fn(() => async () => ({
    data: mockComment,
  })),
}))

vi.mock("../../../redux/actions/userActions", () => ({
  getUserAction: vi.fn(() => async () => {}),
}))

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

const mockComment: CommentData = {
  _id: "comment123",
  createdAt: "2024-02-10",
  comments: ["subComment1", "subComment2"],
  user: mockUser,
  content: "Ceci est un commentaire de test",
}

describe("Comment Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        comment: {
          error: null,
          successMessage: null,
        },
      },
    })
  })

  it("Dispatch getComment et affiche le contenue du commentaire", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Comment id={mockComment._id} />
        </MemoryRouter>
      </Provider>,
    )

    expect(getCommentAction).toHaveBeenCalledTimes(1)
    expect(getCommentAction).toHaveBeenCalledWith(mockComment._id)
    expect(
      await screen.findByText(/Ceci est un commentaire de test/),
    ).toBeInTheDocument()
    expect(await screen.findByText(/John Doe/)).toBeInTheDocument()
  })
})
