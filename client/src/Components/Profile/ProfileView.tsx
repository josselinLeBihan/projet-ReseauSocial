import React, { memo, useEffect, useState } from "react"
import {
  PostDataformated,
  PublicUserInfo,
  UserInfo,
} from "../../redux/api/type"
import CommonLoading from "../Loader/CommonLoading"
import { logger } from "../../utils/logger"
import profilePlaceholder from "../../Assets/profile-placeholder.png"
import AddIcon from "@mui/icons-material/Add"
import {
  getComPostsAction,
  getUserPostsAction,
} from "../../redux/actions/postAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import Post from "../Post/Post"
import { UserData } from "../../App"
import {
  followUserAction,
  unfollowUserAction,
} from "../../redux/actions/profileActions"

interface ProfileViewProps {
  userInfo: PublicUserInfo | undefined
}

const MemoizedPost = memo(Post)
const LIMIT = 5

const ProfileView: React.FC<ProfileViewProps> = ({ userInfo }) => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false)

  const isFollower = useAppSelector((state) => state.user.isFollowing)
  const userPosts: PostDataformated[] = useAppSelector(
    (state) => state.post.userPosts,
  )
  const totalPostsCount: number = useAppSelector(
    (state) => state.post?.totalUserPosts,
  )
  const userData: UserData = useAppSelector((state) => state.auth.userData)

  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false)

  const fetchUserPosts = async (offset = 0) => {
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
  }

  useEffect(() => {
    fetchUserPosts()
    logger.info("CommunityForum monté avec les posts")
  }, [userInfo, dispatch])

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

  logger.debug("ProfileView: ", userInfo)

  const handleFollowingChange = async () => {
    if (!userInfo || !userData) return
    try {
      if (isFollower) {
        dispatch(unfollowUserAction(userData._id, userInfo._id))
      } else {
        dispatch(followUserAction(userData._id, userInfo._id))
      }
    } catch (error) {
      logger.error("Erreur lors de l'ajout/suppression du suivi", error)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-64 bg-gray-50">
        <div
          className="bg-cover bg-center w-1/3 h-full rounded-lg"
          style={{
            backgroundImage: `url(${userInfo?.avatar ? userInfo.avatar : profilePlaceholder})`,
          }}
        />
        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-col ">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{userInfo?.name}</h1>
              <button
                className="flex items-center gap-2 px-2 py-1 text-gray-800 rounded-full"
                onClick={handleFollowingChange}
              >
                <AddIcon />
                {isFollower ? "Abonné" : "Suivre"}
              </button>
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
  )
}

export default ProfileView
