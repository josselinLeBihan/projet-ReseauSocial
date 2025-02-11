import React, { memo, useMemo, useState } from "react"
import ComonLoading from "../Loader/ComonLoading"

import Post from "../Post/Post"
import { PostData } from "../../redux/api/type"

const MemoizedPost = memo(Post)

function MainSection(userdata) {
  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement

  const posts: PostData[] = [] //TODO réccupérer la liste des Posts via l'API

  const LIMIT = 10 //TODO limite du nombre de poste

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  return <div className="">{memoizedPosts}</div>
}

export default MainSection
