import React, { useEffect, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { UserData } from "../../App"
import GroupIcon from "@mui/icons-material/Group"
import { logger } from "../../utils/logger"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { getUserAction } from "../../redux/actions/userActions"
import { UserInfo } from "../../redux/api/type"
import { error } from "loglevel"

interface LeftBarProps {
  userData: UserData
}

interface NavItemProps {
  to: string
  label: string
  icon: React.ReactNode
}

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-gray-800 text-base px-2 py-2 rounded-md flex items-center gap-3 transition ${
        isActive ? "bg-gray-200" : "hover:bg-gray-200"
      }`
    }
  >
    {icon}
    <span className="h-fit">{label}</span>
  </NavLink>
)

const LeftBar: React.FC<LeftBarProps> = ({ userData }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const dispatch = useAppDispatch()

  const navLinks: NavItemProps[] = [
    { to: "/", label: "Accueil", icon: <HomeIcon /> },
    { to: "/community", label: "Communautés", icon: <GroupIcon /> },
    {
      to: `/profile/${userData?._id}`,
      label: "Profile",
      icon: <AccountCircleIcon />,
    },
    { to: "/saved", label: "Sauvegardées", icon: <BookmarkIcon /> },
  ]

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        logger.info("Réccupération des informations de l'utilisateur")
        const userInfoResponse = await dispatch(getUserAction(userData._id))
        if (userInfoResponse?.data) {
          setUserInfo(userInfoResponse.data)
        } else {
          throw error("Aucune information réccupérée", userInfoResponse?.data)
        }
      } catch (error) {
        logger.error("Failed to fetch user info", error)
      }
    }
    fetchUserInfo()
  }, [dispatch, userData])

  const userName = userData?.userName
  const name = userData?.name

  return (
    <div className="flex flex-col w-72 gap-4 p-4 pt-0 bg-gray-50 fixed left-0 top-24 h-full">
      <div className="flex flex-col px-4 py-2 bg-gray-100 rounded-xl justify-start items-start gap-4 border-gray-200 border">
        <div className="flex items-center gap-4">
          <img
            src={profilePlaceholder}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className="flex flex-col flex-1 truncate">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              {name}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-gray-500">
              {`@${userName}`}
            </p>
          </div>
        </div>
        {userInfo && (
          <div className="justify-between items-center flex w-full">
            <div className="self-stretch justify-start items-center inline-flex flex-col">
              <span className="self-stretch text-center text-zinc-900 text-lg font-medium">
                {userInfo.following?.length || 0}
              </span>
              <div className="text-center text-gray-500 text-sm font-normal">
                Following
              </div>
            </div>
            <div className="self-stretch justify-start items-center inline-flex flex-col">
              <span className="self-stretch text-center text-zinc-900 text-lg font-medium">
                {userInfo.followers?.length || 0}
              </span>
              <div className="text-center text-gray-500 text-sm font-normal">
                Follower
              </div>
            </div>
            <div className="self-stretch justify-start items-center inline-flex flex-col">
              <span className="self-stretch text-center text-gray-900 text-lg font-medium">
                {userInfo.totalPosts || 0}
              </span>
              <div className="text-center text-gray-500 text-sm font-normal">
                Posts
              </div>
            </div>
          </div>
        )}
      </div>
      <nav>
        {navLinks.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>
    </div>
  )
}

export default LeftBar
