import React from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"

interface MessageInfoProps {
  userName: string
  createdAt: string
  modifiedAt?: string
}

const MessageInfo = ({ userName, createdAt, modifiedAt }: MessageInfoProps) => (
  <div className="flex items-center gap-4">
    <div className="flex flex-col flex-1 truncate">
      <span className="truncate relative pr-8 font-medium text-gray-900">
        {userName}
      </span>
      <p className="font-normal text-sm leading-tight truncate text-zinc-500">
        {modifiedAt ? `Modifié ${modifiedAt}` : `Créé ${createdAt}`}
      </p>
    </div>
  </div>
)

export default MessageInfo
