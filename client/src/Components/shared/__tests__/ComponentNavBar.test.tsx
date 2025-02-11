import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import "@testing-library/jest-dom"
import ComponentNavBar from "../ComponentNavBar"

describe("ComponentNavBar", () => {
  it("Affiche le bon label et le bon lien", () => {
    render(
      <MemoryRouter>
        <ComponentNavBar to="/accueil" label="Accueil" />
      </MemoryRouter>,
    )

    const link = screen.getByRole("link", { name: /accueil/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/accueil")
  })

  it("Ajoute la classe 'border-teal-600' quand le lien est actif", () => {
    render(
      <MemoryRouter initialEntries={["/accueil"]}>
        <ComponentNavBar to="/accueil" label="Accueil" />
      </MemoryRouter>,
    )

    const link = screen.getByRole("link", { name: /accueil/i })
    expect(link).toHaveClass("border-teal-600")
  })

  it("Ne contient pas la classe 'border-teal-600' quand le lien est inactif", () => {
    render(
      <MemoryRouter initialEntries={["/autre"]}>
        <ComponentNavBar to="/accueil" label="Accueil" />
      </MemoryRouter>,
    )

    const link = screen.getByRole("link", { name: /accueil/i })
    expect(link).not.toHaveClass("border-teal-600")
  })
})
