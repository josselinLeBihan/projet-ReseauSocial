import React from "react"
import { memo } from "react"
import Search from "./Search"
import ProfileButton from "./ProfileButton"
import { UserData } from "../../App"
import { logger } from "../../utils/logger"

interface NavBarProps {
  userData: UserData
}

const NavBar: React.FC<NavBarProps> = ({ userData }) => {
  if (!userData) {
    logger.warn("NavBar n'a aucune donnée utilisateur reçu dans LeftBar")
  } else {
    logger.info("NavBar monté avec les données utilisateur :" + userData)
  }
  return (
    <nav className="h-24 w-full p-6 justify-between items-center inline-flex bg-gray-50 fixed top-0 left-0 z-30">
      <div className="text-teal-800 text-xl font-bold leading-[30px]">
        Tailwind CSS
      </div>
      <div className="justify-end items-center gap-16 flex">
        <Search placeholder="Trouver une communauté, des amis" />
        <ProfileButton userData={userData} />
      </div>
    </nav>
  )
}

export default memo(NavBar)
