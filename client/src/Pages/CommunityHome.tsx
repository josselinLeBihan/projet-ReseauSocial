import React from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"
import { CommunityData } from "../redux/api/type"
import { useAppSelector } from "../redux/store"
import CommunityPresentation from "../Components/Community/CommunityPresentation"

function CommunityHome() {
  const { communityName } = useParams<{ communityName: string }>()

  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  return (
    <div className="flex flex-col gap-6">
      {community && communityName ? (
        <CommunityMainSection communityId={community?._id} />
      ) : (
        <CommunityPresentation />
      )}
    </div>
  )
}

export default CommunityHome
