import React from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import SendIcon from "@mui/icons-material/Send"

function WriteComments({ idPoste }) {
  return (
    <div className="flex gap-4 items-center">
      <img
        src={profilePlaceholder}
        alt="profileImage"
        className="w-11 h-11 shrink-0 rounded-full"
      />
      <input
        className="appearance-none border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-2xl w-full py-2 px-4  text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
        type="text"
        placeholder={"Write your comment"}
      />
      <SendIcon className="text-gray-500 hover:text-gray-900" />
    </div>
  )
}

export default WriteComments
