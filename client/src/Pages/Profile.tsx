import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/store"
import { PublicUserInfo } from "../redux/api/type"

import { UserData } from "../App"
import ProfileView from "../Components/Profile/ProfileView"
import ProfileEdit from "../Components/Profile/ProfileEdit"
import { logger } from "../utils/logger"
import CommonLoading from "../Components/Loader/CommonLoading"
import { getProfileAction } from "../redux/actions/profileActions"

function Profile() {
  const userId = useParams<{ userId: UserData["_id"] }>().userId
  const [loading, setLoading] = useState<boolean>(false)
  const userData = useAppSelector((state) => state.auth.userData)
  const userInfo: PublicUserInfo = useAppSelector(
    (state) => state.user.publicUserProfile,
  )

  const dispatch = useAppDispatch()

  logger.info(
    "Profile monté avec UserID : " + userId + " et UserData : ",
    userData,
  )

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      setLoading(true)
      try {
        const result = await dispatch(getProfileAction(userId, userData?._id))
        logger.info("User Info: ", result?.data)
      } catch (error) {
        logger.error("Erreur lors de la récupération du profil :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [dispatch, userId])

  if (loading)
    return (
      <div className="main-section flex items-center justify-center p-44">
        <CommonLoading />
      </div>
    )

  if (userData?._id === userId) {
    return <ProfileEdit userInfo={userInfo} />
  }

  return <ProfileView userInfo={userInfo} />
}

export default Profile
