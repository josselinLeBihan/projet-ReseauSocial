import React, { useEffect } from "react"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { UserData } from "../../App"
import { CommunityData } from "../../redux/api/type"
import { Link, useLocation } from "react-router-dom"
import {
  getCommunitiesAction,
  getCommunityAction,
} from "../../redux/actions/communityActions"
import { useAppDispatch, useAppSelector } from "../../redux/store"

interface RightBarProps {
  userData: UserData
}

const RightBar: React.FC<RightBarProps> = ({ userData }) => {
  const currentLocation = useLocation().pathname

  const dispatch = useAppDispatch()

  const communities: CommunityData[] = useAppSelector(
    (state) => state.community?.communities,
  )

  useEffect(() => {
    dispatch(getCommunitiesAction())
  }, [dispatch])

  const checkLocation = (chain) => {
    return currentLocation.includes(chain)
  }

  const handleCommunityChange = (e) => {
    const communityName = e.target.innerText

    dispatch(getCommunityAction(communityName))
  }

  return (
    <div className="flex flex-col h-full w-72 gap-4 p-4 pt-0 bg-gray-50 fixed right-0 top-24">
      {checkLocation("/community") && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-600">Mes communautés</p>
          <ul>
            {communities && communities.length > 0 ? (
              communities.map((community) => (
                <Link
                  to={`/community/forum/${community.name}`}
                  className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
                  key={community.name}
                  onClick={handleCommunityChange}
                >
                  <img src={community.image} className="h-6 w-6 rounded-md" />
                  <p>{community.name}</p>
                </Link>
              ))
            ) : (
              <p>Aucune communauté trouvée.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RightBar
