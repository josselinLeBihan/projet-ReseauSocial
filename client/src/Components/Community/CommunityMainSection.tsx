import React, { useEffect, useState } from "react"
import { CommunityData, UserData } from "../../redux/api/type"
import { useAppDispatch } from "../../redux/store"
import { Outlet } from "react-router-dom"
import {
  joinCommunityAndFetchDataAction,
  leaveFetchDataAction,
} from "../../redux/actions/communityActions"
import { logger } from "../../utils/logger"
import ComponentNavBar from "../shared/ComponentNavBar"

interface CommunityMainSectionData {
  community: CommunityData
  userData: UserData
}

const CommunityMainSection: React.FC<CommunityMainSectionData> = ({
  community,
  userData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMember, setIsMember] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (community) {
      const checkMember = community?.members?.includes(userData._id)
      logger.debug(
        "Verification de l'adhesion de l'utilisateur à la communauté. Resulat: ",
        checkMember,
      )
      setIsMember(checkMember || false)
    }
  }, [community])

  const handleMembershipChange = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (!isMember) {
        await dispatch(joinCommunityAndFetchDataAction(community, userData._id))
      } else {
        await dispatch(leaveFetchDataAction(community, userData._id))
      }
    } catch (e) {
      logger.error(
        "Une erreur est survenue lors du changement d'adhesion à la communauté",
        e,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const navLinks = [
    { to: `/community/forum/${community?.name}`, label: "Forum" },
    { to: `/community/about/${community?.name}`, label: "A propos" },
    { to: `/community/Members/${community?.name}`, label: "Membres" },
  ]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-2xl flex-col gap-2 bg-gray-50 border-gray-20 border">
        <img
          src={community?.image || "https://via.placeholder.com/150"}
          className="h-52 object-cover rounded-t-xl"
        />
        <div className="p-6 pb-0 flex flex-col">
          <div className="flex gap-2">
            <h1 className="text-lg text-gray-900 font-medium">
              {community?.name}
            </h1>
            <button
              className="flex bg-teal-600 text-gray-50 hover:bg-teal-700 px-2 py-1 rounded"
              onClick={handleMembershipChange}
            >
              {isMember ? "Quitter" : "Rejoindre"}
            </button>
          </div>
          <p className="text-gray-500">{`${community?.members?.length} membres`}</p>
        </div>
        <nav className="flex rounded-xl overflow-hidden">
          {navLinks.map((link) => (
            <ComponentNavBar key={link.to} {...link} />
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}

export default CommunityMainSection
