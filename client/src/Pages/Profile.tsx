import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/store"
import { UserInfo } from "../redux/api/type"
import { getUserAction } from "../redux/actions/userActions"
import { UserData } from "../App"
import ProfileView from "../Components/Profile/ProfileView"
import ProfileEdit from "../Components/Profile/ProfileEdit"
import { logger } from "../utils/logger"
import CommonLoading from "../Components/Loader/CommonLoading"
import { warn } from "loglevel"

function Profile() {
  const userId = useParams<{ userId: UserData["_id"] }>().userId
  const [loading, setLoading] = useState<boolean>(false)
  const userData = useAppSelector((state) => state.auth.userData)
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const dispatch = useAppDispatch()

  logger.debug("Profile: ", userId)

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      setLoading(true)
      const result = await dispatch(getUserAction(userId))
      setUserInfo(result?.data || undefined)
      logger.warn("User Info: ", result?.data)
    }
    fetchUser()
    setLoading(false)
  }, [dispatch])

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
