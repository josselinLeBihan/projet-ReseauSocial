import React from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"

function CommunityHome() {
  const { communityName } = useParams()

  return (
    <div>
      <CommunityMainSection />
    </div>
  )
}

export default CommunityHome
