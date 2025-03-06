const express = require("express")

const {
  addComment,
  getComment,
  modifyComment,
  deleteComment,
} = require("../controllers/comment.controller")

const router = express.Router()

router.post("/", addComment)
router.get("/:id", getComment)
router.post("/modify/:id", modifyComment)
router.post("/delete/:id", deleteComment)

module.exports = router
