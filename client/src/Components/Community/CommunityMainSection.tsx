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
      <div className="flex rounded-2xl flex-col gap-2 bg-gray-50">
        <img
          src={community?.image}
          className="h-52 object-cover rounded-t-2xl"
        />
        <div className="p-6 pb-0 flex flex-col">
          <div className="flex gap-2">
            <h1 className="text-lg text-gray-900 font-medium">
              {community?.name}
            </h1>
            <button className="flex bg-teal-600 text-gray-50 hover:bg-teal-700 px-2 py-1 rounded">
              Suivre
            </button>
          </div>
          <p className="text-gray-500">{`${community?.members?.length} membres`}</p>
        </div>
        <div className="flex">
          <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
            Forum
          </button>
          <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
            A propos
          </button>
          <button className="flex justify-center items-center px-6 py-2 border-b-2 border-gray-50 hover:border-teal-600">
            Membres
          </button>
        </div>
      </div>
      <PostSubmit />
      {memoizedPosts}
    </div>
  )
}

export default CommunityMainSection
