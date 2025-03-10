import React from "react"
import { CommunityData } from "../../redux/api/type"

interface CommunityCardProps {
  community: CommunityData
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <div className="flex relative aspect-square ">
      <a
        className="abolute top-0 left-0 right-0 bottom-0"
        href={`/community/${community.name}`}
      >
        <div className="flex flex-col flex-1 bg-gray-100 border border-gray-200 rounded-xl cursor-pointer overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${community.image})`,
              backgroundPosition: "50%",
            }}
            className="bg-cover flex h-full"
          ></div>
          <div className="flex flex-col px-3 h-11 bg-slate-100 font-medium text-gray-900 ">
            {community.name}
          </div>
        </div>
      </a>
    </div>
  )
}

export default CommunityCard
