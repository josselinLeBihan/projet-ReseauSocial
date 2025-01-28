import React from "react"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { UserData } from "../../App"
import { useSelector } from "react-redux"
import { CommunityData } from "../../redux/api/type"
import { useLocation } from "react-router-dom"

interface RightBarProps {
  userData: UserData
}

const RightBar: React.FC<RightBarProps> = ({ userData }) => {
  const currentLocation = useLocation().pathname
  const community: CommunityData = useSelector(
    (state) => state.community?.community,
  )

  const checkLocation = (chain) => {
    return currentLocation.includes(chain)
  }

  return (
    <div className="flex flex-col h-full w-72 gap-4 p-4 pt-0 bg-gray-50">
      {checkLocation("/community") && community && (
        <>
          <div className="flex flex-col ">
            <h3 className="text-lg font-semibold">{community?.name}</h3>
            <div className="flex flex-row gap-2 items-center">
              <PeopleAltIcon
                className="text-teal-600"
                style={{ fontSize: "16px" }}
              />
              <p className="text-sm text-teal-600">{`${community?.members?.length} membres`}</p>
            </div>
          </div>
          <img
            src={community?.image}
            alt="comunity image"
            className="w-full h-56"
          />
          <span className="">
            {community?.description.length > 200
              ? community?.description.slice(0, 200) + "..."
              : community?.description}
          </span>
        </>
      )}
    </div>
  )
}

export default RightBar
