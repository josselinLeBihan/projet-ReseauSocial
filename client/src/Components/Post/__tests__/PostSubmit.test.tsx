import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import rootReducer from "../../../redux/reducers/index"
import PostSubmit from "../PostSubmit"
import * as authTypes from "../../../redux/constants/authConstants"
import * as communityTypes from "../../../redux/constants/communityConstants"

import {
  UserData,
  CommunityData,
  PostCreationData,
} from "../../../redux/api/type"
import { addPostAction } from "../../../redux/actions/postAction"

vi.mock("../../../redux/actions/postAction", () => ({
  addPostAction: vi.fn(() => async () => {}),
}))

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
  password: "password123",
}

const mockCommunity: CommunityData = {
  _id: "community123",
  name: "React Community",
  description: "Un groupe de passionnés de React",
  members: [],
  image: "",
}

describe("PostSubmit Component", () => {
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
          <PostSubmit />
        </MemoryRouter>
      </Provider>,
    )

    const textarea = screen.getByPlaceholderText("Ecrivez votre poste ici...")
    expect(textarea).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: "Ceci est un test" } })
    expect(textarea).toHaveValue("Ceci est un test")
  })

  it("Envoie un post lorsqu'on clique sur 'Envoyer'", async () => {
    await act(async () => {
      await store.dispatch({
        type: authTypes.SIGNIN.SUCCESS,
        payload: {
          user: mockUser,
          accessToken: "mockAccessToken",
          refreshToken: "mockRefreshToken",
        },
      })

      await store.dispatch({
        type: communityTypes.GET_COMMUNITY.SUCCESS,
        payload: mockCommunity,
      })
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PostSubmit />
        </MemoryRouter>
      </Provider>,
    )

    const textarea = screen.getByPlaceholderText("Ecrivez votre poste ici...")
    const sendButton = screen.getByText(/Envoyer/i)

    fireEvent.change(textarea, { target: { value: "Mon premier post !" } })
    fireEvent.click(sendButton)

    expect(addPostAction).toHaveBeenCalledTimes(1)
    expect(addPostAction).toHaveBeenCalledWith({
      content: "Mon premier post !",
      user: mockUser._id,
      community: mockCommunity._id,
    } as PostCreationData)
  })
})
