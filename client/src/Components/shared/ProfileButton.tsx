import React, { useEffect, useRef, useState } from "react"
import profilePlaceholer from "../../Assets/profile-placeholder.png"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import { useDispatch } from "react-redux"
import { logoutAction } from "../../redux/actions/authActions"
import { UserData } from "../../App"
import { useAppDispatch } from "../../redux/store"

interface ProfileButtonProps {
  userData: UserData
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ userData }) => {
  const [loggingOut, setLoggingOut] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const name = userData?.name
  const email = userData?.email

  const dispatch = useAppDispatch()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async (e) => {
    e.preventDefault()
    setLoggingOut(true)
    dispatch(logoutAction())
    setLoggingOut(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current && //vérifier si la ref est definie
        !dropdownRef.current.contains(event.target as Node) // Vérifier si le clic est à l'extérieur de l'élément
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown)
  }
  return (
    <div onClick={handleProfileClick} className="cursor-pointer">
      <span className="relative inline-block">
        <img
          src={profilePlaceholer}
          className="object-cover w-10 h-10 rounded-full"
        />
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
      </span>
      {showDropdown && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex" />

          <div
            ref={dropdownRef}
            className="fixed h-full top-0 right-0 w-64 p-4 bg-white z-10 gap-4 flex flex-col "
          >
            <div className="flex mr-auto items-center gap-4 border-b-2 pb-4">
              <img
                src={profilePlaceholer}
                alt="profileImage"
                className="w-16 h-16 shrink-0 rounded-full"
              />
              <div className=" flex flex-col flex-1 truncate">
                <span className="truncate relative pr-8 font-medium text-gray-900">
                  {name}
                </span>
                <p className="font-normal text-base leading-tight truncate text-gray-700">
                  {email}
                </p>
              </div>
            </div>
            <button className="text-gray-800 text-base px-2 py-1 hover:bg-gray-200 rounded-md flex items-center gap-3">
              <PersonIcon />
              <span className="h-fit">Profile</span>
            </button>
            <button className="text-gray-800 text-base px-2 py-1 hover:bg-gray-200 rounded-md flex items-center gap-3">
              <SettingsIcon />
              <span className="h-fit">Settings</span>
            </button>
            <button
              type="submit"
              className="text-red-500 text-sm px-2 py-1 hover:bg-red-200 rounded-md w-fit"
              onClick={handleLogout}
            >
              {loggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileButton
