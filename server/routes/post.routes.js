const express = require("express")

const {
  createPost,
  modifyPost,
  deletePost,
  getCommunityPosts,
  getUserPosts,
  getPost,
  likePost,
  unlikePost,
} = require("../controllers/post.controller")

const router = express.Router()

router.post("/", createPost)
router.post("/modify/:id", modifyPost)
router.post("/delete/:id", deletePost)
router.get("/community/:communityId", getCommunityPosts)
router.get("/user/:userId", getUserPosts)
router.get("/:id", getPost)

router.post("/like/:postId/:userId", likePost)
router.post("/unlike/:postId/:userId", unlikePost)

module.exports = router
