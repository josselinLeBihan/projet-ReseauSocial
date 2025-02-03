export interface SignUpData extends AuthData {
  name: string
  userName: string
}

export interface AuthData {
  email: string
  password: string
}

export interface UserData extends SignUpData {
  _id: string
  avatar?: string
  followers?: UserData[]
  following?: UserData[]
  location?: string
  bio?: string
  interest?: string
  savedPosts?: PostData[]
}

export interface PostChangableData {
  content?: string
  fileUrl?: string
  fileType?: string
}
export interface PostCreationData extends PostChangableData {
  user: string
  community: string
}

export interface PostData extends PostCreationData {
  _id: string
  createdAt: string
  comments?: string[]
}

export interface CommunityData {
  _id: string
  name: string
  description: string
  image: string
  members?: string[]
}

export interface CommentCreationData {
  parentId: string
  parentType: "post" | "comment"
  content: string
  user: string
}

export interface CommentData {
  _id: string
  createdAt: string
  comments?: string[]
  content: string
  user: UserData
}
