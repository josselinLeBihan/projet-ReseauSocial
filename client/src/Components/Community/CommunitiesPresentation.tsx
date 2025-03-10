import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData } from "../../redux/api/type"
import { getCommunitiesAction } from "../../redux/actions/communityActions"
import { logger } from "../../utils/logger"

function CommunitiesPresentation() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const communities: CommunityData[] = useAppSelector(
    (state) => state.community?.joinedCommunities,
  )

  useEffect(() => {
    try {
      dispatch(getCommunitiesAction())
      logger.debug("Communautés récupérées :", communities)
    } catch (e) {
      logger.error("Erreur lors de la récupération des communautés :", e)
    }
  }, [dispatch])

  return <div className="grid grid-cols-3 gap-3 w-full"></div>
}

export default CommunitiesPresentation
