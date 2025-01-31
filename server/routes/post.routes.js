const express = require("express");

const {
  createPost,
  modifyPost,
  deletePost,
  getPosts,
  getPost,
} = require("../controllers/post.controller");

const router = express.Router();

router.post("/", createPost);
router.post("/modify/:id", modifyPost);
router.post("/delete/:id", deletePost);
router.get("/community/:communityId", getPosts);
router.get("/:id", getPost);

module.exports = router;
