const express = require("express");

const { addComment, getComment } = require("../controllers/comment.controller");

const router = express.Router();

router.post("/", addComment);
router.get("/:id", getComment);

module.exports = router;
