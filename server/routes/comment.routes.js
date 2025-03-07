const express = require("express")

const {
  addComment,
  getComment,
  modifyComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../controllers/comment.controller")

const router = express.Router()

router.post("/", addComment)
router.get("/:id", getComment)
router.post("/modify/:id", modifyComment)
router.post("/delete/:id", deleteComment)

router.post("/like/:commentId/:userId", likeComment)
router.post("/unlike/:commentId/:userId", unlikeComment)

module.exports = router
