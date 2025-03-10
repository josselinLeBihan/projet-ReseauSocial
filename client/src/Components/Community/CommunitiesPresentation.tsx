import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData } from "../../redux/api/type"
import { getCommunitiesAction } from "../../redux/actions/communityActions"
import { logger } from "../../utils/logger"
import CommunityCard from "./CommunityCard"

const CommunitiesPresentation: React.FC = () => {
  const dispatch = useAppDispatch()

  const communities: CommunityData[] = useAppSelector(
    (state) => state.community?.communities || [],
  )

  useEffect(() => {
    try {
      dispatch(getCommunitiesAction())
      logger.debug("Communautés récupérées :", communities)
    } catch (e) {
      logger.error("Erreur lors de la récupération des communautés :", e)
    }
  }, [dispatch])

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {communities.map((community, index) => {
          const isLarge = index % 3 === 0 // Modifier ce chiffre pour ajuster la fréquence des grandes cartes

          return (
            <div
              key={community._id}
              className={` ${isLarge ? "col-span-2 row-span-2" : ""} cursor-wait`}
            >
              <CommunityCard community={community} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CommunitiesPresentation
