import React, { memo, useEffect, useMemo, useState } from "react"

import PostSubmit from "../Post/PostSubmit"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { CommunityData, PostData } from "../../redux/api/type"
import { getPostsAction } from "../../redux/actions/postAction"
import Post from "../Post/Post"

const MemoizedPost = memo(Post)

interface CommunityForumData {}
const CommunityForum: React.FC<CommunityForumData> = () => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement
  const [posts, setPosts] = useState<PostData[]>([])

  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        const result = await dispatch(getPostsAction(community._id))
        setPosts(result?.data)
      } catch (e) {
        console.log(e)
      }

      setIsLoading(false)
    }
    fetchPosts()
  }, [community, dispatch])

  const LIMIT = 10 //TODO limite du nombre de poste

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  return (
    <div className="flex flex-col gap-6">
      <PostSubmit />
      {memoizedPosts}
    </div>
  )
}

export default CommunityForum
