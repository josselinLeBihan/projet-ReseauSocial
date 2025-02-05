import React, { useState, ChangeEvent } from "react"
import { signUpAction } from "../redux/actions/authActions"
import { Link, useNavigate } from "react-router-dom"
import { SignUpData } from "../redux/api/type"
import validateSignUpForm, {
  FormulaireData,
} from "../Components/SignUp/SignUpValidation"
import { useAppDispatch, useAppSelector } from "../redux/store"

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingText, setLoadingText] = useState<string>("")
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [sendable, setSendable] = useState<boolean>(false)
  const globalError = useAppSelector((state) => state.auth.signUpError)

  // Stockage des erreurs et statuts de validation
  const [errors, setErrors] = useState<FormulaireData>({
    name: { status: "", error: "" },
    username: { status: "", error: "" },
    email: { status: "", error: "" },
    password: { status: "", error: "" },
    confirmPassword: { status: "", error: "" },
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Fonction pour afficher la couleur de validation
  const showStatus = (status: string) => {
    if (status === "validate") return "border-green-500"
    if (status === "error") return "border-red-500"
    return ""
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))

    // Validation en temps réel
    const validationResults: FormulaireData = validateSignUpForm({
      ...formValues,
      [name]: value,
    })
    setErrors(validationResults)

    if (
      errors.name.status === "validate" &&
      errors.username.status === "validate" &&
      errors.email.status === "validate" &&
      errors.password.status === "validate" &&
      errors.confirmPassword.status === "validate"
    ) {
      setSendable(true)
    } else {
      setSendable(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setLoadingText("Création de compte en cours...")

    const signUpData: SignUpData = {
      name: formValues.name,
      email: formValues.email,
      userName: formValues.username,
      password: formValues.password,
    }

    dispatch(signUpAction(signUpData, navigate)).finally(() =>
      setLoading(false),
    )
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
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            login to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center text-sm text-red-500">{globalError}</p>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            {["name", "username", "email"].map((field) => (
              <div key={field} className="mt-4">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field === "username"
                    ? "Nom d'utilisateur*"
                    : field === "email"
                      ? "Adresse e-mail*"
                      : "Nom*"}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${showStatus(errors[field as keyof FormData].status)}`}
                  value={formValues[field as keyof SignUpData]}
                  onChange={handleChange}
                  required
                />
                {errors[field as keyof FormData].error && (
                  <p className="text-red-500 text-sm">
                    {errors[field as keyof FormData].error}
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
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${showStatus(errors.password.status)}`}
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
              {errors.password.error && (
                <p className="text-red-500 text-sm">{errors.password.error}</p>
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
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${showStatus(errors.confirmPassword.status)}`}
                value={formValues.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword.error && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={!sendable}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !sendable
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? loadingText : "Créer un compte"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
