import React, { memo, useEffect, useMemo, useState } from "react"
import CommonLoading from "../Loader/CommonLoading"

import Post from "../Post/Post"
import { PostDataformated, UserData } from "../../redux/api/type"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { getUserFeedAction } from "../../redux/actions/postAction"
import { logger } from "../../utils/logger"

const MemoizedPost = memo(Post)
const LIMIT = 20

interface MainSectionProps {
  userdata: UserData
}

const MainSection: React.FC<MainSectionProps> = ({ userdata }) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [shouldShowLoader, setShouldShowLoader] = useState(false)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)

  const posts: PostDataformated[] = useAppSelector(
    (state) => state.post.userFeedPosts,
  )

  const fetchCommunityPosts = async (offset = 0) => {
    if (!userdata) return

    setIsLoading(offset === 0)
    setShouldShowLoader(offset === 0)

    try {
      await dispatch(getUserFeedAction(userdata._id, LIMIT, offset))
    } catch (error) {
      logger.error("Erreur lors de la récupération des posts", error)
    }

    setIsLoading(false)
    setShouldShowLoader(false)
  }

  useEffect(() => {
    fetchCommunityPosts()
    logger.info("HomeMainSection monté avec les posts")
  }, [userdata, dispatch])

  const handleLoadMorePost = async () => {
    setIsLoadingMorePosts(true)
    await fetchCommunityPosts(posts.length)
    setIsLoadingMorePosts(false)
  }

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => (
      <MemoizedPost key={post._id} post={post} onReload={fetchCommunityPosts} />
    ))
  }, [posts])

  if (shouldShowLoader || !userdata || !posts) {
    return (
      <div className="main-section flex items-center justify-center p-44">
        <CommonLoading />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {memoizedPosts}
      <button
        className="bg-gray-700 hover:bg-teal-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
        onClick={handleLoadMorePost}
        disabled={isLoadingMorePosts}
      >
        {isLoadingMorePosts ? "Chargement..." : "Afficher plus de posts"}
      </button>
    </div>
  )
}

export default MainSection
