const express = require("express");

const {
  createPost,
  modifyPost,
  deletePost,
  getCommunityPosts,
  getUserPosts,
  getPost,
  likePost,
  unlikePost,
  getUserFeed,
} = require("../controllers/post.controller");

const decodeToken = require("../middlewares/auth/decodeToken");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const fileUpload = require("../middlewares/posts/fileUpload");

router.post("/", fileUpload, createPost);
router.post("/modify/:id", modifyPost);
router.post("/delete/:id", deletePost);
router.get("/community/:communityId", getCommunityPosts);
router.get("/user/:userId", getUserPosts);
router.get("/feed/:userId", decodeToken, requireAuth, getUserFeed);
router.get("/:id", getPost);

router.post("/like/:postId/:userId", likePost);
router.post("/unlike/:postId/:userId", unlikePost);

module.exports = router;
