import React, { memo, useEffect, useState } from "react"
import { PostDataformated, PublicUserInfo } from "../../redux/api/type"
import CommonLoading from "../Loader/CommonLoading"
import { logger } from "../../utils/logger"
import { getUserPostsAction } from "../../redux/actions/postAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import Post from "../Post/Post"
import EditIcon from "@mui/icons-material/Edit"
import EditProfileModal from "../Modals/EditProfileModal"
import { useCallback } from "react"
import {
  getUserAction,
  updateUserAction,
} from "../../redux/actions/userActions"

interface ProfileViewProps {
  userInfo: PublicUserInfo | undefined
}

const MemoizedPost = memo(Post)
const LIMIT = 5

const ProfileEdit: React.FC<ProfileViewProps> = ({ userInfo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false)
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const userPosts: PostDataformated[] = useAppSelector(
    (state) => state.post.userPosts,
  )

  const totalPostsCount: number = useAppSelector(
    (state) => state.post?.totalUserPosts,
  )

  logger.debug("ProfileEdit monté avec les posts", userPosts)

  const fetchUserPosts = useCallback(
    async (offset = 0) => {
      if (!userInfo) return
      setIsLoading(offset === 0)
      setShouldShowLoader(offset === 0)

      try {
        await dispatch(getUserPostsAction(userInfo._id, LIMIT, offset))
      } catch (error) {
        logger.error("Erreur lors de la récupération des posts", error)
      }

      setIsLoading(false)
      setShouldShowLoader(false)
    },
    [userInfo, dispatch],
  )

  useEffect(() => {
    fetchUserPosts()
    logger.debug("ProfileEdit monté avec les posts", userPosts)
  }, [fetchUserPosts])

  const handleLoadMorePost = async () => {
    if (!isLoadingMorePosts && userPosts.length < totalPostsCount) {
      setIsLoadingMorePosts(true)
      await fetchUserPosts(userPosts.length)
      setIsLoadingMorePosts(false)
    }
  }

  if (shouldShowLoader || !userInfo || !userPosts) {
    return (
      <div className="main-section flex items-center justify-center p-44">
        <CommonLoading />
      </div>
    )
  }

  logger.debug("Profile edit: ", userInfo)

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      dispatch(updateUserAction(userInfo._id, formData))
      dispatch(getUserAction(userInfo._id))
    } catch {}
  }

  return (
    <>
      {isShowModal && (
        <EditProfileModal
          onClose={() => {
            setIsShowModal(false)
          }}
          onProfileUpdate={handleUpdateProfile}
          userInfo={userInfo}
        />
      )}
      <div className="flex flex-col gap-6">
        <div className="flex h-64 bg-gray-50 relative">
          <button className="absolute top-2 right-2">
            <EditIcon
              className=" bg-white rounded-full text-gray-900"
              onClick={() => setIsShowModal(true)}
            />
          </button>

          <div
            className="bg-cover bg-center w-1/3 h-full rounded-lg"
            style={{
              backgroundImage: `url(${userInfo?.avatar})`,
            }}
          ></div>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col ">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">{userInfo?.name}</h1>
              </div>
              <p className="text-gray-500">{`@${userInfo?.userName}`}</p>
            </div>
            <p className="text-gray-800 h-full w-full">{userInfo?.bio}</p>
          </div>
        </div>
        {isLoading
          ? "Chargement..."
          : userPosts.map((post) => (
              <MemoizedPost
                key={post._id}
                post={post}
                onReload={fetchUserPosts}
              />
            ))}
        {userPosts.length < totalPostsCount && (
          <button
            className="bg-gray-700 hover:bg-teal-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
            onClick={handleLoadMorePost}
            disabled={isLoadingMorePosts}
          >
            {isLoadingMorePosts ? "Chargement..." : "Afficher plus de posts"}
          </button>
        )}
      </div>
    </>
  )
}

export default ProfileEdit
