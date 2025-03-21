const express = require("express")

const {
  verifyEmailValidation,
  verifyEmail,
} = require("../middlewares/user/verifyEmail")

const {
  addContextData,
  signup,
  signin,
  logout,
} = require("../controllers/auth.controller")

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)

//router.get("/verify", verifyEmailValidation, verifyEmail, addContextData)

module.exports = router
