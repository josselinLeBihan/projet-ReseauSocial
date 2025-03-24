const express = require("express")

const { signup, signin, logout } = require("../controllers/auth.controller")
const avatarUpload = require("../middlewares/user/avatarUpload")

const router = express.Router()

router.post("/signup", avatarUpload, signup)
router.post("/signin", signin)
router.post("/logout", logout)

module.exports = router
