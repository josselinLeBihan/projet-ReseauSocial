import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import AddIcon from "@mui/icons-material/Add"
import { useAppDispatch, useAppSelector } from "../redux/store"
import { useNavigate } from "react-router-dom"
import { signUpAction } from "../redux/actions/authActions"
import { logger } from "../utils/logger"
import Input from "../Components/shared/Input"

interface SignUpFormData {
  profileImage?: File[]
  name: string
  userName: string
  email: string
  password: string
  confirmPassword: string
}

const schema = z
  .object({
    profileImage: z
      .array(z.instanceof(File))
      .optional()
      .refine(
        (files) =>
          !files || files.length === 0 || files[0]?.size < 2 * 1024 * 1024,
        "L'image doit être inférieure à 2Mo",
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          ["image/jpeg", "image/png"].includes(files[0]?.type),
        "Format autorisé : JPEG ou PNG",
      ),
    name: z.string().nonempty("Le nom est nécessaire"),
    userName: z.string().nonempty("Le nom de l'utilisateur est nécessaire"),
    email: z
      .string()
      .email("L'adresse email est invalide")
      .max(50, "L'email est trop long")
      .min(5, "L'email est trop court"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(50, "Le mot de passe est trop long")
      .nonempty("Le mot de passe est nécessaire"),
    confirmPassword: z.string().nonempty("La confirmation est nécessaire"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

const InputList = {
  name: {
    label: "Name",
    type: "text",
    placeholder: "John Doe",
    showHideButton: false,
  },
  userName: {
    label: "Nom d'utilisateur",
    type: "text",
    placeholder: "JohnDoe",
    showHideButton: false,
  },
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
  confirmPassword: {
    label: "Confirmer le mot de passe",
    type: "password",
    placeholder: "*********",
    showHideButton: true,
  },
}

function SignUp() {
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const signupError = useAppSelector((state) => state.auth.signUpError)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: zodResolver(schema) })

  const imageFile = watch("profileImage")
  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0]

      setPreview(URL.createObjectURL(file))

      const fileSize =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(2)} Ko`
          : `${(file.size / (1024 * 1024)).toFixed(2)} Mo`

      setFileInfo({ name: file.name, size: fileSize })
    }
  }, [imageFile])

  const handleFileChange = (event) => {
    const files: File[] = Array.from(event.target.files)
    if (files.length > 0) {
      setValue("profileImage", files)
    }
  }

  const onSubmit = async (data) => {
    logger.info("Début de la création de compte.")

    setLoading(true)

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("userName", data.userName)

    if (data.profileImage && data.profileImage.length > 0) {
      formData.append("avatar", data.profileImage[0])
    }

    try {
      dispatch(signUpAction(formData, navigate)).finally(() =>
        setLoading(false),
      )
      logger.info("Fin du processus de création de compte")
    } catch (error) {
      logger.error("Echec de la création de compte :", error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          S'inscrire
        </h2>
        {signupError && (
          <p className="text-red-500 text-center">{signupError}</p>
        )}
        {loading && (
          <p className="text-blue-500 text-center">
            Création de compte en cours...
          </p>
        )}

        {/*Avatar - Sélection de l'image */}
        <div className="flex flex-col">
          <p className="font-medium text-gray-700">
            Choisir une image de profil
          </p>
          <div className="flex gap-4 items-center">
            <div
              className="h-16 w-16 rounded-full bg-slate-300 relative cursor-pointer flex items-center justify-center"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <AddIcon className="h-10 w-10 text-gray-500 bg-white rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              {fileInfo && <p>{`${fileInfo.name} (${fileInfo.size})`}</p>}
              {errors.profileImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profileImage.message}
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

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
          <p className="text-center text-gray-700 text-sm">Déjà un compte ?</p>
          <a
            href="/signin"
            className="text-blue-900 text-sm hover:text-decoration-line:underline"
          >
            Se connecter
          </a>
        </div>
      </form>
    </div>
  )
}

export default SignUp
