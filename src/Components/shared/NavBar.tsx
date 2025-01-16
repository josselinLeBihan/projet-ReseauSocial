import React from "react"
import { memo } from "react"
import Search from "./Search"
import ProfileButton from "../Input/ProfileButton"

function NavBar() {
  return (
    <nav className="h-[91px] w-full p-6 justify-between items-center inline-flex bg-gray-50">
      <div className="text-teal-800 text-xl font-bold leading-[30px]">
        Tailwind CSS
      </div>
      <div className="justify-end items-center gap-16 flex">
        <Search placeholder="Trouver une communauté, des amis" />
        <ProfileButton />
      </div>
    </nav>
  )
}

export default memo(NavBar)
