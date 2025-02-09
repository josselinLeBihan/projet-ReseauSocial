import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import rootReducer from "../../../redux/reducers/index"
import Post from "../Post"
import { PostData, UserData } from "../../../redux/api/type"
import { getUserAction } from "../../../redux/actions/userActions"
import logger from "../../../utils/logger"

vi.mock("../../../redux/actions/userActions", () => ({
  getUserAction: vi.fn(() => async () => ({ data: mockUser })), // Simule un succès de récupération de l'utilisateur
}))

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

const mockPost: PostData = {
  _id: "post123",
  createdAt: "2024-02-10",
  comments: ["comment1", "comment2"],
  user: "user123",
  community: "community123",
  content: "Ceci est un post de test",
  fileUrl: "",
  fileType: "",
}

describe("Post Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        post: {
          posts: [],
          error: null,
          post: null,
          successMessage: null,
        },
      },
    })
  })

  it("affiche le contenu du post et le nom de l'utilisateur", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("Ceci est un post de test")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("@john_doe")).toBeInTheDocument()
  })

  it("affiche le bon nombre de commentaires", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText("2")).toBeInTheDocument()
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

    expect(screen.getByText("Envoyer")).toBeInTheDocument()
  })

  it("appelle `getUserAction` au chargement du composant", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    await act(async () => {})

    expect(getUserAction).toHaveBeenCalledWith(mockPost.user)
  })

  it("affiche une erreur dans logger.error si la récupération des données utilisateur échoue", async () => {
    vi.spyOn(logger, "error").mockImplementation(() => {})

    vi.mock("../../../redux/actions/userActions", () => ({
      getUserAction: vi.fn(() => async () => {
        throw new Error("Erreur récupération utilisateur")
      }),
    }))

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Post post={mockPost} />
        </MemoryRouter>
      </Provider>,
    )

    await act(async () => {})

    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching user",
      expect.any(Error),
    )
  })
})
