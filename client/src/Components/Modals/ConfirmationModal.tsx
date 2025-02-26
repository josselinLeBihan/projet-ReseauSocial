import React from "react"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

interface ConfirmationModalProps {
  title: string
  message: string
  buttonCancelText: string
  buttonConfirmText: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  buttonCancelText,
  buttonConfirmText,
}) => {
  return (
    <div className="fixed w-full max-w-lg z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex rounded-2xl bg-white p-6 shadow gap-4">
        <WarningAmberIcon className="text-gray-700" style={{ fontSize: 40 }} />
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-gray-900">{message}</p>
          <div className="flex gap-4 justify-end">
            <button
              className="px-4 py-3 md:py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold text-sm md:ml-2"
              onClick={() => onCancel()}
            >
              {buttonCancelText}
            </button>
            <button
              className="px-4 py-3 md:py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg font-semibold text-sm md:ml-2"
              onClick={() => onConfirm()}
            >
              {buttonConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
