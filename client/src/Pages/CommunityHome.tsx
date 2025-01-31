import React from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"
import { useSelector } from "react-redux"
import { CommunityData } from "../redux/api/type"

function CommunityHome() {
  const community: CommunityData = useSelector(
    (state) => state.community?.community,
  )

  return (
    <div>
      {community && <CommunityMainSection communityId={community?._id} />}
    </div>
  )
}

export default CommunityHome
