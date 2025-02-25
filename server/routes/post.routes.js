const express = require("express")

const {
  createPost,
  modifyPost,
  deletePost,
  getCommunityPosts,
  getPost,
} = require("../controllers/post.controller")

const router = express.Router()

router.post("/", createPost)
router.post("/modify/:id", modifyPost)
router.post("/delete/:id", deletePost)
router.get("/community/:communityId", getCommunityPosts)
router.get("/:id", getPost)

module.exports = router
