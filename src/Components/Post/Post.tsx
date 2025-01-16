import React from "react"

interface PostProps {
  post: {
    content: string
    fileUrl?: string
    fileType?: string
    user: string
    community: string
    createdAt: string
    comments?: string[]
  }
}

function Post({ post }: PostProps) {
  const { content, fileUrl, fileType, user, community, createdAt, comments } =
    post
  console.log(post)

  return <></>
}

export default Post
