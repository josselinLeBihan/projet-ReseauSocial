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

export interface PostCreationData {
  content: string
  fileUrl?: string
  fileType?: string
  userId: string
  community: string
}

export interface PostData extends PostCreationData {
  id: string
  createdAt: string
  comments?: string[]
}

export interface CommunityData {
  name: string
  description: string
  image: string
  members?: UserData[]
}

export interface CommentData {
  body: string
  user: UserData
  child: CommentData[]
}
