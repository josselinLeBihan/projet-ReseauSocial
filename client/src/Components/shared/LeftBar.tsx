import React, { useEffect, useState } from "react"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { UserData } from "../../App"
import GroupIcon from "@mui/icons-material/Group"

interface LeftBarProps {
  userData: UserData
}

const LeftBar: React.FC<LeftBarProps> = ({ userData }) => {
  const userName = userData?.userName
  const name = userData?.name

  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-72 gap-4 p-4 pt-0 bg-gray-50 fixed left-0 top-24 h-full">
      <div className="flex flex-col px-4 py-2 bg-zinc-100 rounded-lg  justify-start items-start gap-4 ">
        <div className="flex items-center gap-4">
          <img
            src={profilePlaceholder}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className=" flex flex-col flex-1 truncate">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              {name}
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              {`@${userName}`}
            </p>
          </div>
        </div>
        <div className="justify-between items-center  flex w-full">
          <div className="self-stretch justify-start items-center inline-flex flex-col">
            <span className="self-stretch text-center text-zinc-900 text-lg font-medium">
              5.5k
            </span>
            <div className="text-center text-zinc-500 text-sm font-normal ">
              Follower
            </div>
          </div>
          <div className="self-stretch justify-start items-center inline-flex flex-col">
            <span className="self-stretch text-center text-zinc-900 text-lg font-medium">
              568
            </span>
            <div className="text-center text-zinc-500 text-sm font-normal ">
              Following
            </div>
          </div>
          <div className="self-stretch justify-start items-center inline-flex flex-col">
            <span className="self-stretch text-center text-zinc-900 text-lg font-medium">
              112
            </span>
            <div className="text-center text-zinc-500 text-sm font-normal ">
              Posts
            </div>
          </div>
        </div>
      </div>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-gray-800 text-base px-2 py-2 rounded-md flex items-center gap-3 transition ${
              isActive ? "bg-gray-300" : "hover:bg-gray-200"
            }`
          }
        >
          <HomeIcon />
          <span className="h-fit">Home</span>
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `text-gray-800 text-base px-2 py-2 rounded-md flex items-center gap-3 transition ${
              isActive ? "bg-gray-300" : "hover:bg-gray-200"
            }`
          }
        >
          <GroupIcon />
          <span className="h-fit">Community</span>
        </NavLink>
        <NavLink
          to="/Profile" //TODO: Add the correct path
          className={({ isActive }) =>
            `text-gray-800 text-base px-2 py-2 rounded-md flex items-center gap-3 transition ${
              isActive ? "bg-gray-300" : "hover:bg-gray-200"
            }`
          }
        >
          <AccountCircleIcon />
          <span className="h-fit">Profile</span>
        </NavLink>
        <NavLink
          to="/saved" //TODO: Add the correct path
          className={({ isActive }) =>
            `text-gray-800 text-base px-2 py-2 rounded-md flex items-center gap-3 transition ${
              isActive ? "bg-gray-400" : "hover:bg-gray-200"
            }`
          }
        >
          <BookmarkIcon />
          <span className="h-fit">Saved</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default LeftBar
