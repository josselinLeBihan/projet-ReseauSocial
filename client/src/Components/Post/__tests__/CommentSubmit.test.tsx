import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import rootReducer from "../../../redux/reducers/index"
import CommentSubmit from "../CommentSubmit"
import * as authTypes from "../../../redux/constants/authConstants"
import { UserData, CommentCreationData } from "../../../redux/api/type"
import { addCommentAction } from "../../../redux/actions/commentAction"

vi.mock("../../../redux/actions/commentAction", () => ({
  addCommentAction: vi.fn(() => async () => {}),
}))

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

describe("CommentSubmit Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Rend le champ de texte et enregistre la saisie", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommentSubmit parentId="post123" parentType="post" />
        </MemoryRouter>
      </Provider>,
    )

    const input = screen.getByPlaceholderText("Ecrivez votre commentaire")
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: "Ceci est un test" } })
    expect(input).toHaveValue("Ceci est un test")
  })

  it("Envoie un commentaire lorsqu'on clique sur 'Envoyer'", async () => {
    await act(async () => {
      await store.dispatch({
        type: authTypes.SIGNIN.SUCCESS,
        payload: {
          user: mockUser,
          accessToken: "mockAccessToken",
          refreshToken: "mockRefreshToken",
        },
      })
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CommentSubmit parentId="post123" parentType="post" />
        </MemoryRouter>
      </Provider>,
    )

    const input = screen.getByPlaceholderText("Ecrivez votre commentaire")
    const sendButton = screen.getByTestId("send-button")

    fireEvent.change(input, { target: { value: "Mon premier commentaire !" } })
    fireEvent.click(sendButton)

    expect(addCommentAction).toHaveBeenCalledTimes(1)
    expect(addCommentAction).toHaveBeenCalledWith({
      parentId: "post123",
      parentType: "post",
      content: "Mon premier commentaire !",
      user: mockUser._id,
    } as CommentCreationData)
  })
})
