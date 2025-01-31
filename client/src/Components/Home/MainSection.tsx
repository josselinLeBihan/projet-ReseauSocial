import React, { memo, useMemo, useState } from "react"
import ComonLoading from "../Loader/ComonLoading"

import Post from "../Post/Post"

// Mémorise le post pour éviter des re-render non nécessaire
const MemoizedPost = memo(Post)
//TODO Supprimé tempPost
const tempPost = {
  _id: "1",
  content: "texte",
  user: "Josselin",
  community: "Tests",
  createAt: "16/01/2025",
}

function MainSection(userdata) {
  const [isLoading, setIsLoading] = useState(false) //TODO gestion du chargement

  const posts = [tempPost] //TODO réccupérer la liste des Posts via l'API

  const LIMIT = 10 //TODO limite du nombre de poste

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />)
  }, [posts])

  return <div className="">{memoizedPosts}</div>
}

export default MainSection
