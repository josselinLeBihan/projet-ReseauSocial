import React from "react"
import profilePlaceholer from "../../Assets/profile-placeholder.png"

function LeftBar() {
  return (
    <div className="flex flex-col h-full w-72 gap-8 p-4">
      <div className="flex mr-auto items-center gap-4 pb-4">
        <img
          src={profilePlaceholer}
          alt="profileImage"
          className="w-11 h-11 shrink-0 rounded-full"
        />
        <div className=" flex flex-col flex-1 truncate">
          <span className="truncate relative pr-8 font-medium text-gray-900">
            Name
          </span>
          <p className="font-normal text-base leading-tight truncate text-gray-700">
            @Jisso
          </p>
        </div>
      </div>
    </div>
  )
}

export default LeftBar
