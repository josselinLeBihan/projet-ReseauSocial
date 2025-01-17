interface Comment {
  _id: string
  content: string
  user: string
  createdAt: string
  childComments?: CommentProps[]
}

interface CommentProps {
  id: string
}

export const tempComment: Comment[] = [
  {
    _id: "parent_1",
    content: "This is temporate parent comment",
    user: "josselin",
    createdAt: new Date().toISOString(),
    childComments: [{ id: "child1" }, { id: "child2" }],
  },
  {
    _id: "child1",
    content: "This is child comment 1",
    user: "user1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "child2",
    content: "This is child comment 2",
    user: "user2",
    createdAt: new Date().toISOString(),
  },
]
