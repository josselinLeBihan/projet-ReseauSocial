import React from "react"
import { UserInfo } from "../../redux/api/type"
import CommonLoading from "../Loader/CommonLoading"
import { logger } from "../../utils/logger"

interface ProfileEditProps {
  userInfo: UserInfo | undefined
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ userInfo }) => {
  logger.debug("ProfileEdit: ", userInfo)

  return <div className="flex flex-col "></div>
}

export default ProfileEdit
