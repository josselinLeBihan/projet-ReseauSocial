import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import "@testing-library/jest-dom"
import LeftBar from "../LeftBar"
import { UserData } from "../../../App"

const mockUser: UserData = {
  _id: "user123",
  name: "John Doe",
  userName: "john_doe",
  email: "johndoe@example.com",
}

describe("LeftBar Component", () => {
  it("Affiche les informations de l'utilisateur", () => {
    render(
      <MemoryRouter>
        <LeftBar userData={mockUser} />
      </MemoryRouter>,
    )

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("@john_doe")).toBeInTheDocument()
  })

  it("Affiche tous les liens de navigation", () => {
    render(
      <MemoryRouter>
        <LeftBar userData={mockUser} />
      </MemoryRouter>,
    )

    expect(screen.getByRole("link", { name: /Accueil/i })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByRole("link", { name: /Communautés/i })).toHaveAttribute(
      "href",
      "/community",
    )
    expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute(
      "href",
      "/profile",
    )
    expect(screen.getByRole("link", { name: /Sauvegardées/i })).toHaveAttribute(
      "href",
      "/saved",
    )
  })

  it("Ajoute la classe 'bg-gray-300' quand un lien est actif", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <LeftBar userData={mockUser} />
      </MemoryRouter>,
    )

    const profileLink = screen.getByRole("link", { name: /Profile/i })
    expect(profileLink).toHaveClass("bg-gray-300")
  })

  it("Ne contient pas la classe 'bg-gray-300' quand un lien est inactif", () => {
    render(
      <MemoryRouter initialEntries={["/accueil"]}>
        <LeftBar userData={mockUser} />
      </MemoryRouter>,
    )

    const profileLink = screen.getByRole("link", { name: /Profile/i })
    expect(profileLink).not.toHaveClass("bg-gray-300")
  })
})
