import React, { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInAction } from "../redux/actions/authActions"
import { AuthData } from "../redux/api/type"
import { useAppDispatch } from "../redux/store"
import { logger } from "../utils/logger"

function SignIn() {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingText, setLoadingText] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loginError, setLoginError] = useState<boolean>(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSignUp = () => {
    logger.info("Redirection vers la page d'inscription")
    navigate("/signup")
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    logger.info("Début de la connexion avec :", { email })
    setLoading(true)
    setLoadingText("Connexion au compte en cour ...")

    const data: AuthData = {
      email,
      password,
    }

    const timeOut = setTimeout(() => {
      setLoadingText("Cela prend plus de temps que prévu...")
      logger.warn("Connexion plus longue que prévu")
    }, 5000)

    try {
      const result: { success: boolean; message?: string } = await dispatch(
        signInAction(data, navigate),
      )

      if (result.success) {
        logger.info("Connexion réussie pour :", email)
      } else {
        throw new Error(result.message)
      }

      setLoading(false)
      clearTimeout(timeOut)
      logger.info("Fin du processus de connexion")
    } catch (error) {
      logger.error("Échec de la connexion :", error)
      setLoginError(true)
    }
  }

  return (
    <div className="py-16">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl set">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Brand
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>

          <div className="mt-4">
            {loginError && (
              <p className="text-red-500 text-center">
                Email ou mot de passe incorrect. Veuillez vérifier vos
                informations et réessayer.
              </p>
            )}
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${!loginError ? `border-gray-300` : `border-red-500`} rounded py-2 px-4 block w-full appearance-none`}
              type="email"
              onChange={handleEmailChange}
              data-testid="email-input"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe
              </label>
              <a href="#" className="text-xs text-gray-500">
                Mot de passe oublié ?
              </a>
            </div>
            <input
              className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${!loginError ? `border-gray-300` : `border-red-500`} rounded py-2 px-4 block w-full appearance-none`}
              type="password"
              onChange={handlePasswordChange}
              data-testid="password-input"
            />
          </div>
          <div className="mt-8">
            <button
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              onClick={handleSubmit}
            >
              Se connecter
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <a
              href="#"
              className="text-xs text-gray-500 uppercase"
              onClick={handleSignUp}
            >
              ou s'inscrire
            </a>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
