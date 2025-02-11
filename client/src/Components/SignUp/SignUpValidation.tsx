interface ChampData {
  status: "validate" | "error" | ""
  error: string
}

export interface FormulaireData {
  name: ChampData
  username: ChampData
  email: ChampData
  password: ChampData
  confirmPassword: ChampData
}

export const nameValidation = (name: string): ChampData => {
  if (!name.trim()) {
    return { status: "error", error: "Le nom d'utilisateur est requis." }
  }
  if (name.trim().length > 15) {
    return {
      status: "error",
      error: "Le nom doit faire moins de 15 caractères.",
    }
  }
  return { status: "validate", error: "" }
}

export const usernameValidation = (username: string): ChampData => {
  if (!username.trim()) {
    return { status: "error", error: "Le nom d'utilisateur est requis." }
  }
  return { status: "validate", error: "" }
}

export const emailValidation = (email: string): ChampData => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: "error", error: "L'adresse e-mail est incorrecte." }
  }
  return { status: "validate", error: "" }
}

export const passwordValidation = (password: string): ChampData => {
  if (password.length < 6 || !/\d/.test(password)) {
    return {
      status: "error",
      error:
        "Le mot de passe doit avoir au moins 6 caractères et contenir un chiffre.",
    }
  }
  return { status: "validate", error: "" }
}

export const confirmPasswordValidation = (
  password: string,
  confirmPassword: string,
): ChampData => {
  if (password !== confirmPassword) {
    return { status: "error", error: "Les mots de passe ne correspondent pas." }
  }
  return { status: "validate", error: "" }
}

const SignUpValidation = (form): FormulaireData => {
  const validationResult: FormulaireData = {
    name: nameValidation(form.name),
    username: usernameValidation(form.username),
    email: emailValidation(form.email),
    password: passwordValidation(form.password),
    confirmPassword: confirmPasswordValidation(
      form.password,
      form.confirmPassword,
    ),
  }
  return validationResult
}

export default SignUpValidation
