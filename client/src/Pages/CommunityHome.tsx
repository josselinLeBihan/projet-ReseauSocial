import React from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"
import { CommunityData, UserData } from "../redux/api/type"
import { useAppSelector } from "../redux/store"
import CommunityPresentation from "../Components/Community/CommunityPresentation"
import logger from "../utils/logger"

function CommunityHome() {
  const { communityName } = useParams<{ communityName: string }>()
  const userData: UserData = useAppSelector((state) => state.auth?.userData)
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  logger.info("Changment de communauté: ", community) //TODO

  return (
    <div className="flex flex-col gap-6">
      {community && communityName ? (
        <CommunityMainSection community={community} userData={userData} />
      ) : (
        <CommunityPresentation />
      )}
    </div>
  )
}

export default CommunityHome
