import React from "react"
import { CommunityData } from "../../redux/api/type"

interface CommunityCardProps {
  community: CommunityData
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <div className="">
      <a href={`/community/${community.name}/forum`} className="block">
        <div className="relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden aspect-square hover:bg-gray-200 group">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{ backgroundImage: `url(${community.image})` }}
          />
          <div className="absolute bottom-0 w-full px-3 py-2 bg-gray-100 text-gray-900 font-medium group-hover:bg-gray-200">
            {community.name}
          </div>
        </div>
      </a>
    </div>
  )
}

export default CommunityCard
