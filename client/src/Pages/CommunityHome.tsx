import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import CommunityMainSection from "../Components/Community/CommunityMainSection"
import { CommunityData, UserData } from "../redux/api/type"
import { useAppDispatch, useAppSelector } from "../redux/store"
import CommunityPresentation from "../Components/Community/CommunityPresentation"
import { logger } from "../utils/logger"
import { getCommunityAction } from "../redux/actions/communityActions"

const CommunityHome: React.FC = () => {
  const { communityName } = useParams<{ communityName: string }>()
  const dispatch = useAppDispatch()

  const userData: UserData = useAppSelector((state) => state.auth?.userData)
  const community: CommunityData | null = useAppSelector(
    (state) => state.community?.community,
  )

  useEffect(() => {
    if (!community && communityName) {
      dispatch(getCommunityAction(communityName))
    }
  }, [dispatch, community, communityName])

  useEffect(() => {
    if (!userData) {
      logger.warn("Aucune donnée utilisateur reçue dans CommunityHome")
    } else {
      logger.info(
        "CommunityHome monté avec les données utilisateur :",
        userData,
      )
    }
  }, [userData])

  return (
    <div className="flex flex-col gap-6">
      {community && communityName ? (
        <CommunityMainSection community={community} userData={userData} />
      ) : (
        <CommunityPresentation />
      )}
    </div>
  )
}

export default CommunityHome
