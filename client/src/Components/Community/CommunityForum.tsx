import React, { memo, useEffect, useMemo, useState } from "react"

import PostSubmit from "../Post/PostSubmit"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData, PostData, PostDataformated } from "../../redux/api/type"
import { getComPostsAction } from "../../redux/actions/postAction"
import Post from "../Post/Post"
import { logger } from "../../utils/logger"

const MemoizedPost = memo(Post)

interface CommunityForumData {}
const CommunityForum: React.FC<CommunityForumData> = () => {
  const LIMIT = 5

  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement
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
    logger.info("Lancement de la réccupération des posts de la communauté")
    if (!communityData) return

    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        await dispatch(getComPostsAction(communityData._id, LIMIT, 0))
      } catch (error) {
        logger.error(
          "Erreur lors de la réccupération des posts de la communauté",
          error,
        )
      }
      setIsLoading(false)
    }
    fetchPosts()
    logger.info("Fin de la réccupération des posts de la communauté")
  }, [communityData, dispatch])

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  const handleLoadMorePost = async () => {
    console.log("load more posts")
    if (
      !isLoadMorePostLoading &&
      posts.length > 0 &&
      posts.length < totalCommunityPosts
    ) {
      logger.info(
        "Lancement de la réccupération de plus de posts de la communauté",
      )

      try {
        setIsLoadMorePostLoading(true)
        await dispatch(
          getComPostsAction(communityData._id, LIMIT, posts.length),
        )
        setIsLoadMorePostLoading(false)
      } catch (error) {
        logger.error(
          "Erreur lors de la réccupération de plus de posts de la communauté",
          error,
        )
      }
      logger.info("Fin de la réccupération de plus de posts de la communauté")
    }
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
