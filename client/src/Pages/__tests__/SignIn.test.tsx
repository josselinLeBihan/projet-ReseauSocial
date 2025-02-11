import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import SignIn from "../SignIn"
import rootReducer from "../../redux/reducers"
import { signInAction } from "../../redux/actions/authActions"
import logger from "../../utils/logger"

vi.mock("../../redux/actions/authActions", () => ({
  signInAction: vi.fn(() => async () => ({ success: true })),
}))

describe("SignIn Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Affiche le formulaire de connexion", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText(/Welcome back!/)).toBeInTheDocument()
    expect(screen.getByText("Email Address")).toBeInTheDocument()
    expect(screen.getByText("Mot de passe")).toBeInTheDocument()
    expect(screen.getByText("Se connecter")).toBeInTheDocument()
  })

  it("Permet de saisir l'email et le mot de passe", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("password123")
  })

  it("Affiche un message d'erreur en cas d'échec de connexion", async () => {
    vi.mock("../../redux/actions/authActions", () => ({
      signInAction: vi.fn(() => async () => ({ success: false })),
    }))
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const submitButton = screen.getByText("Se connecter")

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(
      await screen.findByText(/Email ou mot de passe incorrect/),
    ).toBeInTheDocument()
  })

  it("Envoie l'action signInAction lors de la soumission du formulaire", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const submitButton = screen.getByText("Se connecter")

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(signInAction).toHaveBeenCalledTimes(2)
    expect(signInAction).toHaveBeenCalledWith(
      { email: "test@example.com", password: "password123" },
      expect.any(Function),
    )
  })
})
