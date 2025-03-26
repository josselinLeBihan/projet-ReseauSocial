import React, { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInAction } from "../redux/actions/authActions"
import { AuthData } from "../redux/api/type"
import { useAppDispatch, useAppSelector } from "../redux/store"
import { logger } from "../utils/logger"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Input from "../Components/shared/Input"

interface SignInFormData {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().nonempty("Le mot de passe est nécessaire"),
})

const InputList = {
  email: {
    label: "Email",
    type: "email",
    placeholder: "john@mail.fr",
    showHideButton: false,
  },
  password: {
    label: "Mot de passe",
    type: "password",
    placeholder: "**********",
    showHideButton: true,
  },
}

function SignIn() {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingText, setLoadingText] = useState<string>("")
  const signinError = useAppSelector((state) => state.auth.signInError)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignInFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    logger.info("Début de la connexion avec ", data.email)

    const timeOut = setTimeout(() => {
      setLoadingText("Cela prend plus de temps que prévu...")
      logger.warn("Connexion plus longue que prévu")
    }, 5000)

    const authData: AuthData = {
      email: data.email,
      password: data.password,
    }

    try {
      await dispatch(signInAction(data, navigate))
      setLoading(false)
      clearTimeout(timeOut)
      logger.info("Fin du processus de connexion")
    } catch {}
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Se connecter
        </h2>
        {signinError && (
          <p className="text-red-500 text-center">{signinError}</p>
        )}
        {loadingText && (
          <p className="text-blue-500 text-center">loadingText</p>
        )}
        {Object.entries(InputList).map(([name, input], key) => (
          <Input
            key={key}
            name={name}
            label={input.label}
            type={input.type}
            register={register}
            error={errors[name]}
            placeholder={input.placeholder}
            showHideButton={input.showHideButton}
          />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
        <div className="flex gap-4">
          <p className="text-center text-gray-700 text-sm">
            Vous n'avez pas encore de compte ?
          </p>
          <a
            href="/signup   "
            className="text-blue-900 text-sm hover:text-decoration-line:underline"
          >
            S'inscrire
          </a>
        </div>
      </form>
    </div>
  )
}

export default SignIn
