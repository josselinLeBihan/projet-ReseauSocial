import React, { useState } from "react"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

interface InputConfig {
  label: string
  type: string
  placeholder: string
  showHideButton?: boolean
  inputType?: "input" | "textarea"
}

export type InputListType = Record<string, InputConfig>
interface InputProps extends InputConfig {
  name: string
  register: any
  error: any
  defaultValues?: string
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  register,
  error,
  placeholder,
  showHideButton,
  defaultValues,
  inputType,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">{label}</label>
      {error && <p className="text-red-500 text-sm mb-1">{error.message}</p>}
      <div className="flex items-center gap-2">
        {inputType === "textarea" ? (
          <textarea
            defaultValue={defaultValues}
            placeholder={placeholder}
            {...register(name)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 h-24 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400"
            }`}
          />
        ) : (
          <input
            type={showHideButton && showPassword ? "text" : type}
            defaultValue={defaultValues}
            placeholder={placeholder}
            {...register(name)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-400"
            }`}
          />
        )}

        {showHideButton && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-700 cursor-pointer"
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </button>
        )}
      </div>
    </div>
  )
}

export default Input
