import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import rootReducer from "../../../redux/reducers/index"
import Post from "../Post"
import { PostDataformated, UserFormatedData } from "../../../redux/api/type"

const mockUser: UserFormatedData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
}

const mockPost: PostDataformated = {
  _id: "post123",
  createdAt: "2024-02-10",
  comments: [
    "comment1",
    "comment2",
    "comment3",
    "comment4",
    "comment5",
    "comment6",
  ],
  user: mockUser,
  community: "community123",
  content: "Ceci est un post de test",
  fileUrl: "",
  fileType: "",
}

vi.mock("../../../redux/actions/userActions", () => ({
  getUserAction: vi.fn(() => async () => ({
    data: mockUser,
  })),
}))

describe("Post Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Affiche le contenu du post", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("Ceci est un post de test")).toBeInTheDocument()
  })

  it("affiche le bon nombre de commentaires", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("6")).toBeInTheDocument()
  })

  it("affiche la section des commentaires lorsque le bouton est cliqué", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    const commentButton = screen.getByTestId("comment-button")
    expect(commentButton).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(commentButton)
    })
    const sendButton = screen.getByTestId("send-button")
    expect(sendButton).toBeInTheDocument()
  })

  it("affiche des commentaires supplémentaires en cliquant sur le bouton'Voir plus'", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    const commentButton = screen.getByTestId("comment-button")
    expect(commentButton).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(commentButton)
    })

    const moreCommentButton = screen.getByText("Afficher plus de commentaires")
    expect(moreCommentButton).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(moreCommentButton)
    })

    expect(moreCommentButton).not.toBeInTheDocument()
  })
})
