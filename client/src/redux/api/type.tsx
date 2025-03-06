export interface SignUpData extends AuthData {
  name: string
  userName: string
}

export interface AuthData {
  email: string
  password: string
}

export interface UserProfile {
  accessToken: string
  refreshToken: string
  accessTokenUpdatedAt: Date
  user: UserData
}

export interface UserFormatedData {
  _id: string
  name: string
  userName: string
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
  fileType?: string | null
  fileUrl?: string | null
}
export interface PostCreationData extends PostChangableData {
  user: string
  community: string
}

export interface PostDataformated {
  _id: string
  createdAt: string
  modifiedAt?: string
  comments: string[]
  user: UserFormatedData
  community: string
  content: string
  fileUrl?: string
  fileType?: string
}

export interface PostData extends PostCreationData {
  _id: string
  createdAt: string
  modifiedAt?: string
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

export interface CommentDataFormated {
  _id: string
  createdAt: string
  modifyAt?: string
  comments: string[]
  user: UserFormatedData
  content: string
}

export interface CommentData extends CommentChangableData {
  _id: string
  createdAt: string
  modifiedAt?: string
  comments?: string[]
  user: UserData
}

export interface CommentChangableData {
  content: string
}

export interface CommentDeleteData {
  _id: string
  parentId: string
  parentType: "post" | "comment"
}
