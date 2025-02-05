import React from "react"
import { CommunityData } from "../../redux/api/type"
import { useAppSelector } from "../../redux/store"

function CommunityAbout() {
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  return (
    <div className="flex flex-col p-6 rounded-2xl gap-2 bg-slate-50">
      <p className="text-lg font-medium text-gray-900 ">Présentation</p>
      {community.description}
    </div>
  )
}

export default CommunityAbout
