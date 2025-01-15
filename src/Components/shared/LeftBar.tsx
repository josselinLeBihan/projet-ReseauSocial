import React from "react"
import profilePlaceholer from "../../Assets/profile-placeholder.png"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { Link } from "react-router-dom"

function LeftBar() {
  return (
    <div className="flex flex-col h-full w-72 gap-4 p-4">
      <div className="flex flex-col px-4 py-2 bg-zinc-100 rounded-lg  justify-start items-start gap-4 ">
        <div className="flex items-center gap-4">
          <img
            src={profilePlaceholer}
            alt="profileImage"
            className="w-11 h-11 shrink-0 rounded-full"
          />
          <div className=" flex flex-col flex-1 truncate">
            <span className="truncate relative pr-8 font-medium text-gray-900">
              Jisso Arami
            </span>
            <p className="font-normal text-sm leading-tight truncate text-zinc-500">
              @Jisso
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
      <Link
        to="/"
        className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
      >
        <HomeIcon />
        <span className="h-fit">Home</span>
      </Link>
      <Link
        to="/" //TODO: Add the correct path
        className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
      >
        <AccountCircleIcon />
        <span className="h-fit">Profile</span>
      </Link>
      <Link
        to="/" //TODO: Add the correct path
        className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
      >
        <BookmarkIcon />
        <span className="h-fit">Saved</span>
      </Link>
    </div>
  )
}

export default LeftBar
