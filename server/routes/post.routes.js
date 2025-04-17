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
  savePost,
  unsavePost,
  getUserFeed,
  getSavedPosts,
} = require("../controllers/post.controller")

const decodeToken = require("../middlewares/auth/decodeToken")
const passport = require("passport")
const requireAuth = passport.authenticate("jwt", { session: false })

const router = express.Router()
const fileUpload = require("../middlewares/posts/fileUpload")

router.use(requireAuth, decodeToken)

router.post("/", fileUpload, createPost)
router.post("/modify/:id", modifyPost)
router.post("/delete/:id", deletePost)
router.get("/community/:communityId", getCommunityPosts)
router.get("/user/:userId", getUserPosts)
router.get("/feed/:userId", getUserFeed)
router.get("/saved", getSavedPosts)
router.get("/:id", getPost)

router.post("/like/:postId", likePost)
router.post("/unlike/:postId", unlikePost)
router.post("/:id/save", savePost)
router.post("/:id/unsave", unsavePost)

module.exports = router
