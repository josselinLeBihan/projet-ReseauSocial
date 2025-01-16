import React, { memo, useMemo, useState } from "react"
import ComonLoading from "../Loader/ComonLoading"
import Post from "../Post/Post"

// Mémorise le post pour éviter des re-render non nécessaire
const MemoizedPost = memo(Post)

function MainSection() {
  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement
  const tempPost = {
    _id: "1",
    content: "texte",
    user: "Josselin",
    community: "Tests",
    createAt: "16/01/2025",
  }
  const posts = [tempPost] //TODO réccupérer la liste des Posts

  const LIMIT = 10 //TODO limite du nombre de poste
  if (isLoading) {
    return <ComonLoading />
  }

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  return <div className="">{memoizedPosts}</div>
}

export default MainSection
