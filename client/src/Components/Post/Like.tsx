import React, { useState } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"

function Like() {
  const [numberLikes, setNumberLikes] = useState(0)
  return (
    <div className="flex gap-2">
      <button className="text-gray-500 hover:text-gray-900 text-sms">
        <ThumbUpIcon />
      </button>
      <span>{numberLikes}</span>
    </div>
  )
}

export default Like
