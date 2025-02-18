import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import SignUp from "../SignUp"
import rootReducer from "../../redux/reducers"
import { signUpAction } from "../../redux/actions/authActions"
import { logger } from "../../utils/logger"

vi.mock("../../redux/actions/authActions", () => ({
  signUpAction: vi.fn(() => async () => ({ success: true })),
}))

describe("SignUp Component", () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    })
  })

  it("Affiche le formulaire d'inscription", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText(/Create a new account/)).toBeInTheDocument()
    expect(screen.getByText("Nom*")).toBeInTheDocument()
    expect(screen.getByText("Nom d'utilisateur*")).toBeInTheDocument()
    expect(screen.getByText("Adresse e-mail*")).toBeInTheDocument()
    expect(screen.getByText("Mot de passe*")).toBeInTheDocument()
    expect(
      screen.getByText("Confirmation du mot de passe*"),
    ).toBeInTheDocument()
    expect(screen.getByText("Créer un compte")).toBeInTheDocument()
  })

  it("Permet de saisir les champs du formulaire", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    )

    const nameInput = screen.getByTestId("name-input")
    const emailInput = screen.getByTestId("email-input")
    const usernameInput = screen.getByTestId("username-input")
    const passwordInput = screen.getByTestId("password-input")
    const confirmPasswordInput = screen.getByTestId("confirmPassword-input")

    fireEvent.change(nameInput, { target: { value: "John Doe" } })
    fireEvent.change(usernameInput, { target: { value: "john_doe" } })
    fireEvent.change(emailInput, { target: { value: "john@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } })

    expect(nameInput).toHaveValue("John Doe")
    expect(usernameInput).toHaveValue("john_doe")
    expect(emailInput).toHaveValue("john@example.com")
    expect(passwordInput).toHaveValue("password123")
    expect(confirmPasswordInput).toHaveValue("password123")
  })

  it("Empêche l'inscription si les champs sont vides", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    )

    const submitButton = screen.getByText("Créer un compte")

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(signUpAction).not.toHaveBeenCalled()
  })

  it("Envoie l'action signUpAction lors de la soumission du formulaire", async () => {
    vi.mock("../../Components/SignUp/SignUpValidation", () => ({
      default: vi.fn(() => ({
        name: { status: "validate", error: "" },
        username: { status: "validate", error: "" },
        email: { status: "validate", error: "" },
        password: { status: "validate", error: "" },
        confirmPassword: { status: "validate", error: "" },
      })),
    }))

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    )

    const nameInput = screen.getByTestId("name-input")
    const emailInput = screen.getByTestId("email-input")
    const usernameInput = screen.getByTestId("username-input")
    const passwordInput = screen.getByTestId("password-input")
    const confirmPasswordInput = screen.getByTestId("confirmPassword-input")
    const submitButton = screen.getByTestId("submit-button")

    fireEvent.change(nameInput, { target: { value: "John Doe" } })
    fireEvent.change(usernameInput, { target: { value: "john_doe" } })
    fireEvent.change(emailInput, { target: { value: "john@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(signUpAction).toHaveBeenCalledTimes(1)
    expect(signUpAction).toHaveBeenCalledWith(
      {
        name: "John Doe",
        email: "john@example.com",
        userName: "john_doe",
        password: "password123",
      },
      expect.any(Function),
    )
  })
})
