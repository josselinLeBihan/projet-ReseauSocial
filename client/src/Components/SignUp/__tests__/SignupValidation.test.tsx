import { describe, expect, it } from "vitest"
import SignUpValidation from "../SignUpValidation"
import {
  nameValidation,
  usernameValidation,
  emailValidation,
  passwordValidation,
  confirmPasswordValidation,
} from "../SignUpValidation"

describe("Validation des champs du formulaire d'inscription", () => {
  it("nameValidation retourne une erreur si le nom est vide", () => {
    expect(nameValidation("")).toEqual({
      status: "error",
      error: "Le nom d'utilisateur est requis.",
    })
  })

  it("nameValidation retourne une erreur si le nom dépasse 15 caractères", () => {
    expect(nameValidation("abcdefghijklmnop")).toEqual({
      status: "error",
      error: "Le nom doit faire moins de 15 caractères.",
    })
  })

  it("nameValidation retourne 'validate' si le nom est valide", () => {
    expect(nameValidation("JohnDoe")).toEqual({ status: "validate", error: "" })
  })

  it("usernameValidation retourne une erreur si le username est vide", () => {
    expect(usernameValidation("")).toEqual({
      status: "error",
      error: "Le nom d'utilisateur est requis.",
    })
  })

  it("usernameValidation retourne 'validate' si le username est valide", () => {
    expect(usernameValidation("john_doe")).toEqual({
      status: "validate",
      error: "",
    })
  })

  it("emailValidation retourne une erreur pour un email invalide", () => {
    expect(emailValidation("invalid-email")).toEqual({
      status: "error",
      error: "L'adresse e-mail est incorrecte.",
    })
  })

  it("emailValidation retourne 'validate' pour un email valide", () => {
    expect(emailValidation("test@example.com")).toEqual({
      status: "validate",
      error: "",
    })
  })

  it("passwordValidation retourne une erreur si le mot de passe est trop court", () => {
    expect(passwordValidation("abc")).toEqual({
      status: "error",
      error:
        "Le mot de passe doit avoir au moins 6 caractères et contenir un chiffre.",
    })
  })

  it("passwordValidation retourne une erreur si le mot de passe n'a pas de chiffre", () => {
    expect(passwordValidation("abcdef")).toEqual({
      status: "error",
      error:
        "Le mot de passe doit avoir au moins 6 caractères et contenir un chiffre.",
    })
  })

  it("passwordValidation retourne 'validate' pour un mot de passe valide", () => {
    expect(passwordValidation("abc123")).toEqual({
      status: "validate",
      error: "",
    })
  })

  it("confirmPasswordValidation retourne une erreur si les mots de passe ne correspondent pas", () => {
    expect(confirmPasswordValidation("abc123", "xyz456")).toEqual({
      status: "error",
      error: "Les mots de passe ne correspondent pas.",
    })
  })

  it("confirmPasswordValidation retourne 'validate' si les mots de passe correspondent", () => {
    expect(confirmPasswordValidation("abc123", "abc123")).toEqual({
      status: "validate",
      error: "",
    })
  })

  it("validateSignUpForm valide correctement un formulaire complet", () => {
    const validForm = {
      name: "John",
      username: "john_doe",
      email: "john@example.com",
      password: "abc123",
      confirmPassword: "abc123",
    }

    expect(SignUpValidation(validForm)).toEqual({
      name: { status: "validate", error: "" },
      username: { status: "validate", error: "" },
      email: { status: "validate", error: "" },
      password: { status: "validate", error: "" },
      confirmPassword: { status: "validate", error: "" },
    })
  })
})
