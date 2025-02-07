import React from "react"
import { CommunityData, PostData } from "../../redux/api/type"
import { useAppSelector } from "../../redux/store"
import { NavLink, Outlet } from "react-router-dom"
import CommunityForum from "./CommunityForum"

interface CommunityMainSectionData {
  communityId: string
}

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600 transition ${
        isActive ? "border-teal-600" : ""
      }`
    }
  >
    <span className="h-fit">{label}</span>
  </NavLink>
)

const CommunityMainSection: React.FC<CommunityMainSectionData> = ({
  communityId,
}) => {
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  const navLinks = [
    { to: `/community/forum/${community.name}`, label: "Forum" },
    { to: `/community/about/${community.name}`, label: "A propos" },
    { to: `/community/Members/${community.name}`, label: "Membres" },
  ]

  const handleOnClick = () => {
    //TODO ajout de l'utilisateur à la communauté
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-2xl flex-col gap-2 bg-gray-50">
        <img
          src={community?.image}
          className="h-52 object-cover rounded-t-2xl"
        />
        <div className="p-6 pb-0 flex flex-col">
          <div className="flex gap-2">
            <h1 className="text-lg text-gray-900 font-medium">
              {community?.name}
            </h1>
            <button
              className="flex bg-teal-600 text-gray-50 hover:bg-teal-700 px-2 py-1 rounded"
              onClick={handleOnClick}
            >
              Suivre
            </button>
          </div>
          <p className="text-gray-500">{`${community?.members?.length} membres`}</p>
        </div>
        <nav className="flex">
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}

export default CommunityMainSection
