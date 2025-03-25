import React, { useState } from "react"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

interface InputProps {
  name: string
  label: string
  type: string
  register: any
  error: any
  placeholder: string
  showHideButton?: boolean
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  register,
  error,
  placeholder,
  showHideButton,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium">{label}</label>
      {error && <p className="text-red-500 text-sm mb-1">{error.message}</p>}
      <div className="flex items-center gap-2">
        <input
          type={showHideButton && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-400"
          }`}
        />
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
