import React, { useRef, useState } from "react"
import { UserInfo } from "../../redux/api/type"
import useClickOutside from "../../hook/useClickOutside"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAppSelector } from "../../redux/store"
import AddIcon from "@mui/icons-material/Add"
import { useForm } from "react-hook-form"
import Input, { InputListType } from "../../Components/shared/Input"
import { logger } from "../../utils/logger"
import ConfirmationModal from "./ConfirmationModal"

interface EditProfileModalProps {
  userInfo: UserInfo
  onClose: () => void
  onProfileUpdate: (formData: FormData) => Promise<void>
}

const validationSchema = z
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
    bio: z.string().max(1000, "La bio est trop longue (max: 1000 caractères)"),
    interest: z
      .string()
      .max(
        1000,
        "Les centres d'intérêt sont trop longs (max: 1000 caractères)",
      ),
    location: z
      .string()
      .max(1000, "La localisation est trop longue (max: 1000 caractères)"),
    name: z.string().nonempty("Le nom est nécessaire"),
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

const inputFields: InputListType = {
  name: {
    label: "Nom",
    type: "text",
    placeholder: "John Doe",
    showHideButton: false,
    inputType: "input",
  },
  email: {
    label: "Email",
    type: "email",
    placeholder: "john@mail.fr",
    showHideButton: false,
    inputType: "input",
  },
  password: {
    label: "Mot de passe",
    type: "password",
    placeholder: "**********",
    showHideButton: true,
    inputType: "input",
  },
  confirmPassword: {
    label: "Confirmer le mot de passe",
    type: "password",
    placeholder: "*********",
    showHideButton: true,
    inputType: "input",
  },
}

const descriptionFields: InputListType = {
  interest: {
    label: "Centres d'intérêt",
    type: "text",
    placeholder: "Camping, Hiking, Fishing",
    showHideButton: false,
    inputType: "textarea",
  },
  bio: {
    label: "Bio",
    type: "text",
    placeholder: "Hi there! I'm using ...",
    showHideButton: false,
    inputType: "textarea",
  },
  location: {
    label: "Localisation",
    type: "text",
    placeholder: "France",
    showHideButton: false,
  },
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  userInfo,
  onProfileUpdate,
}) => {
  const modalRef = useClickOutside(handleModalClose)
  const signupError = useAppSelector((state) => state.auth.signUpError)
  const [fileDetails, setFileDetails] = useState<{
    name: string
    size: string
  } | null>(null)
  const [isConfirmQuitModalVisible, setIsConfirmQuitModalVisible] =
    useState(false)
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    userInfo.avatar,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  logger.info("EditProfileModal component rendered")

  function handleModalClose() {
    const currentValues = getValues()
    const hasChanges = Object.keys(userInfo).some((key) => {
      if (key === "avatar") return false
      return currentValues[key] !== userInfo[key]
    })
    if (hasChanges) {
      logger.info("Unsaved changes detected, showing confirmation modal")
      setIsConfirmQuitModalVisible(true)
    } else {
      onClose()
    }
  }

  const handleFileSelection = (event) => {
    const selectedFiles: File[] = Array.from(event.target.files)
    if (selectedFiles.length > 0) {
      logger.debug("File selected:", selectedFiles[0])
      setValue("profileImage", selectedFiles)
    }
  }

  const {
    getValues,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) })

  const selectedImageFile = watch("profileImage")
  React.useEffect(() => {
    if (selectedImageFile && selectedImageFile.length > 0) {
      const file = selectedImageFile[0]
      logger.debug("Image file updated:", file)

      setImagePreview(URL.createObjectURL(file))

      const formattedFileSize =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(2)} Ko`
          : `${(file.size / (1024 * 1024)).toFixed(2)} Mo`

      setFileDetails({ name: file.name, size: formattedFileSize })
    }
  }, [selectedImageFile])

  const prepareFormData = (formData) => {
    const dataToSubmit = new FormData()
    dataToSubmit.append("name", formData.name)
    dataToSubmit.append("email", formData.email)
    dataToSubmit.append("password", formData.password)
    dataToSubmit.append("bio", formData.bio)
    dataToSubmit.append("interest", formData.interest)
    dataToSubmit.append("location", formData.location)

    if (formData.profileImage && formData.profileImage.length > 0) {
      dataToSubmit.append("avatar", formData.profileImage[0])
    }

    logger.info("Form data prepared for submission", formData)
    onProfileUpdate(dataToSubmit)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex" />
      <div
        className="fixed w-full max-w-4xl z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg justify-center items-center"
        ref={modalRef}
      >
        {isConfirmQuitModalVisible && (
          <ConfirmationModal
            title="Confirmer la fermeture"
            message="Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?"
            onConfirm={onClose}
            onCancel={() => setIsConfirmQuitModalVisible(false)}
            buttonCancelText="Annuler"
            buttonConfirmText="Confirmer"
          />
        )}
        <form
          onSubmit={handleSubmit(prepareFormData)}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Modifier le profil
          </h2>
          {signupError && (
            <p className="text-red-500 text-center">{signupError}</p>
          )}

          <div className="flex gap-8">
            <div className="flex flex-col gap-4 w-full">
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
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <AddIcon className="h-10 w-10 text-gray-500 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    {fileDetails && (
                      <p>{`${fileDetails.name} (${fileDetails.size})`}</p>
                    )}
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
                      onChange={handleFileSelection}
                    />
                  </div>
                </div>
              </div>

              {Object.entries(inputFields).map(([name, input], key) => (
                <Input
                  key={key}
                  name={name}
                  label={input.label}
                  type={input.type}
                  register={register}
                  error={errors[name]}
                  placeholder={input.placeholder}
                  showHideButton={input.showHideButton}
                  defaultValues={userInfo[name]}
                  inputType={input.inputType}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4 w-full">
              {Object.entries(descriptionFields).map(([name, input], key) => (
                <Input
                  key={key}
                  name={name}
                  label={input.label}
                  type={input.type}
                  register={register}
                  error={errors[name]}
                  placeholder={input.placeholder}
                  showHideButton={input.showHideButton}
                  defaultValues={userInfo[name]}
                  inputType={input.inputType}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="w-60 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Envoyer les modifications
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditProfileModal
