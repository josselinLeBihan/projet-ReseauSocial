import React, { memo, useEffect, useMemo, useState } from "react"
import PostSubmit from "../Post/PostSubmit"
import Post from "../Post/Post"
import { CommunityData, PostData } from "../../redux/api/type"
import { getPostsAction } from "../../redux/actions/postAction"
import { useAppDispatch, useAppSelector } from "../../redux/store"

const MemoizedPost = memo(Post)

interface CommunityMainSectionData {
  communityId: string
}

const CommunityMainSection: React.FC<CommunityMainSectionData> = ({
  communityId,
}) => {
  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement
  const [posts, setPosts] = useState<PostData[]>([])
  const community: CommunityData = useAppSelector(
    (state) => state.community?.community,
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        const result = await dispatch(getPostsAction(communityId))
        setPosts(result?.data)
      } catch (e) {
        console.log(e)
      }

      setIsLoading(false)
    }
    fetchPosts()
  }, [communityId, dispatch])

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

export default CommunityMainSection
