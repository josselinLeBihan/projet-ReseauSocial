import React, { memo, useEffect, useMemo, useState } from "react"
import PostSubmit from "../Post/PostSubmit"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData, PostDataformated } from "../../redux/api/type"
import { getComPostsAction } from "../../redux/actions/postAction"
import Post from "../Post/Post"
import { logger } from "../../utils/logger"
import CommonLoading from "../Loader/CommonLoading"

const MemoizedPost = memo(Post)

const CommunityForum: React.FC = () => {
  const LIMIT = 5
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false) // Gérer l'affichage différé du loader
  const [isLoadMorePostLoading, setIsLoadMorePostLoading] = useState(false)

  const posts: PostDataformated[] = useAppSelector(
    (state) => state.post.communityPosts,
  )
  const totalCommunityPosts: number = useAppSelector(
    (state) => state.post?.totalCommunityPosts,
  )

  const communityData: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  useEffect(() => {
    if (!communityData) return

    const fetchPosts = async () => {
      setIsLoading(true)
      const timer = setTimeout(() => setShowLoader(true), 500) // Délai de 500ms

      try {
        await dispatch(getComPostsAction(communityData._id, LIMIT, 0))
      } catch (error) {
        logger.error("Erreur lors de la récupération des posts", error)
      }

      clearTimeout(timer) // Annuler le timer si la requête finit avant 500ms
      setIsLoading(false)
      setShowLoader(false)
    }

    fetchPosts()
  }, [communityData, dispatch])

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  const handleLoadMorePost = async () => {
    if (
      !isLoadMorePostLoading &&
      posts.length > 0 &&
      posts.length < totalCommunityPosts
    ) {
      try {
        setIsLoadMorePostLoading(true)
        await dispatch(
          getComPostsAction(communityData._id, LIMIT, posts.length),
        )
      } catch (error) {
        logger.error("Erreur lors du chargement des posts", error)
      }
      setIsLoadMorePostLoading(false)
    }
  }

  if (showLoader || !communityData || !posts) {
    return (
      <div className="main-section flex items-center justify-center p-44">
        <CommonLoading />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PostSubmit />
      {isLoading ? "Chargement..." : memoizedPosts}
      {posts.length < totalCommunityPosts && (
        <button
          className="bg-gray-700 hover:bg-blue-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
          onClick={handleLoadMorePost}
          disabled={isLoadMorePostLoading}
        >
          {isLoadMorePostLoading ? "Chargement..." : "Afficher plus de posts"}
        </button>
      )}
    </div>
  )
}

export default CommunityForum
