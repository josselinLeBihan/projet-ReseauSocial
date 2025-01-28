import React, { useEffect, useState, ChangeEvent } from "react"
import { useDispatch } from "react-redux"
import { signUpAction } from "../redux/actions/authActions"
import { useNavigate } from "react-router-dom"
import { SignUpData } from "../redux/api/type"

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingText, setLoadingText] = useState<string>("")
  const [formValues, setFormValues] = useState<SignUpData>({
    name: "",
    email: "",
    userName: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  })
  const [globalError, setGlobalError] = useState<string>("")
  const [isReady, setIsReady] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Valide chaque champ individuellement
  const validateFields = () => {
    const newErrors: typeof errors = {
      name:
        formValues.name.trim().length > 15
          ? "Le nom doit faire moins de 15 caractères."
          : "",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
        ? ""
        : "L'adresse e-mail est incorrecte.",
      userName: formValues.userName.trim()
        ? ""
        : "Le nom d'utilisateur est requis.",
      password:
        formValues.password.length >= 6 && /\d/.test(formValues.password)
          ? ""
          : "Le mot de passe doit avoir au moins 6 caractères et contenir un chiffre.",
      confirmPassword:
        formValues.password === confirmPassword
          ? ""
          : "Les mots de passe ne correspondent pas.",
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }

  // Met à jour `isReady` en fonction de la validation
  useEffect(() => {
    setIsReady(validateFields())
  }, [formValues, confirmPassword])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "confirmPassword") {
      setConfirmPassword(value)
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateFields()) {
      setLoading(true)
      setLoadingText("Création de compte en cours...")

      dispatch<any>(signUpAction(formValues, navigate)).finally(() =>
        setLoading(false),
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://www.svgrepo.com/show/301692/login.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            login to your account
          </a>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {}
          <form onSubmit={handleSubmit}>
            {["name", "userName", "email"].map((field) => (
              <div key={field} className="mt-4">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field === "userName"
                    ? "Nom d'utilisateur*"
                    : field === "email"
                      ? "Adresse e-mail*"
                      : "Nom*"}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formValues[field as keyof SignUpData]}
                  onChange={handleChange}
                  required
                />
                {errors[field as keyof typeof errors] && (
                  <p className="text-red-500 text-sm">
                    {errors[field as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}

            {/* Password */}
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe*
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmation du mot de passe*
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={!isReady || loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isReady && !loading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? loadingText : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
