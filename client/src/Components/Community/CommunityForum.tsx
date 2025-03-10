import React, { memo, useEffect, useState } from "react"
import PostSubmit from "../Post/PostSubmit"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData, PostDataformated } from "../../redux/api/type"
import { getComPostsAction } from "../../redux/actions/postAction"
import Post from "../Post/Post"
import { logger } from "../../utils/logger"
import CommonLoading from "../Loader/CommonLoading"

const MemoizedPost = memo(Post)
const LIMIT = 5

const CommunityForum: React.FC = () => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [shouldShowLoader, setShouldShowLoader] = useState(false)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)

  const communityPosts: PostDataformated[] = useAppSelector(
    (state) => state.post.communityPosts,
  )
  const totalPostsCount: number = useAppSelector(
    (state) => state.post?.totalCommunityPosts,
  )
  const communityData: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  const fetchCommunityPosts = async (offset = 0) => {
    if (!communityData) return

    setIsLoading(offset === 0)
    setShouldShowLoader(offset === 0)

    try {
      await dispatch(getComPostsAction(communityData._id, LIMIT, offset))
    } catch (error) {
      logger.error("Erreur lors de la récupération des posts", error)
    }

    setIsLoading(false)
    setShouldShowLoader(false)
  }

  useEffect(() => {
    fetchCommunityPosts()
    logger.info("CommunityForum monté avec les posts")
  }, [communityData, dispatch])

  const handleLoadMorePost = async () => {
    if (!isLoadingMorePosts && communityPosts.length < totalPostsCount) {
      setIsLoadingMorePosts(true)
      await fetchCommunityPosts(communityPosts.length)
      setIsLoadingMorePosts(false)
    }
  }

  if (shouldShowLoader || !communityData || !communityPosts) {
    return (
      <div className="main-section flex items-center justify-center p-44">
        <CommonLoading />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PostSubmit onPostSubmit={fetchCommunityPosts} />
      {isLoading
        ? "Chargement..."
        : communityPosts.map((post) => (
            <MemoizedPost
              key={post._id}
              post={post}
              onReload={fetchCommunityPosts}
            />
          ))}

      {communityPosts.length < totalPostsCount && (
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

export default CommunityForum
