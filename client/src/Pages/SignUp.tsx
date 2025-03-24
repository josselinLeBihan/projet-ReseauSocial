import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import AddIcon from "@mui/icons-material/Add"
import useToggle from "../hook/useToggle"
import { useAppDispatch } from "../redux/store"
import { useNavigate } from "react-router-dom"
import { SignUpData } from "../redux/api/type"
import { signUpAction } from "../redux/actions/authActions"
import { logger } from "../utils/logger"

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

function SignUp() {
  const [loading, setLoading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useToggle()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

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
    const files = event.target.files
    if (files.length > 0) {
      setValue("profileImage", files)
    }
  }

  const onSubmit = (data) => {
    logger.info("Début de la création de compte.")

    setLoading(true)

    const signUpData: SignUpData = {
      name: data.name,
      image: data.profileImage,
      email: data.email,
      userName: data.username,
      password: data.password,
    }
    try {
      dispatch(signUpAction(signUpData, navigate)).finally(() =>
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

        {/* Champ Name */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Name</label>
          {errors.name && (
            <p className="text-red-500 text-sm mb-1">{errors.name.message}</p>
          )}
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Champ UserName */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Nom d'utilisateur</label>
          {errors.userName && (
            <p className="text-red-500 text-sm mb-1">
              {errors?.userName?.message}
            </p>
          )}
          <input
            type="text"
            placeholder="JoeDoe"
            {...register("userName")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.userName
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Champ Email */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Email</label>
          {errors.email && (
            <p className="text-red-500 text-sm mb-1">{errors.email.message}</p>
          )}
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Champ Password */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Mot de passe</label>
          {errors.userName && (
            <p className="text-red-500 text-sm mb-1">
              {errors?.password?.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-400"
              }`}
            />
            <button
              type="button"
              onClick={setShowPassword}
              className="text-gray-700 cursor-pointer"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
        </div>

        {/* Champ ConfirmPassword */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">
            Confirmer le mot de passe
          </label>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-1">
              {errors?.confirmPassword?.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-400"
              }`}
            />
            <button
              type="button"
              onClick={setShowPassword}
              className="text-gray-700 cursor-pointer"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignUp
