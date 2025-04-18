import React, { useEffect } from "react"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { UserData } from "../../App"
import { CommunityData } from "../../redux/api/type"
import { Link, useLocation } from "react-router-dom"
import {
  getCommunitiesAction,
  getCommunityAction,
  getJoinedCommunitiesAction,
} from "../../redux/actions/communityActions"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { logger } from "../../utils/logger"

interface RightBarProps {}

const RightBar: React.FC<RightBarProps> = () => {
  logger.info("RightBar monté : récupération des communautés en cours...")
  const currentLocation = useLocation().pathname

  const dispatch = useAppDispatch()

  const communities: CommunityData[] = useAppSelector(
    (state) => state.community?.joinedCommunities,
  )
  const userData: UserData = useAppSelector((state) => state.auth?.userData)

  useEffect(() => {
    if (!checkLocation("/community")) return
    try {
      dispatch(getJoinedCommunitiesAction(userData._id))
      logger.debug("Communautés récupérées :", communities)
    } catch (e) {
      logger.error("Erreur lors de la récupération des communautés :", e)
    }
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
                  to={`/community/${community.name}/forum`}
                  className="text-gray-800 text-base px-2 py-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
                  key={community.name}
                  onClick={handleCommunityChange}
                >
                  <img src={community.image} className="h-6 w-6 rounded-md" />
                  {community.name}
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
