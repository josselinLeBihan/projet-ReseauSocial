// filepath: e:\dossier_important\travail\Web\Projets\projet-ReseauSocial\server\routes\profile.routes.js
const express = require("express")
const passport = require("passport")

const {
  followUser,
  unfollowUser,
  getProfile,
} = require("../controllers/profile.controller")

const decodeToken = require("../middlewares/auth/decodeToken")

const router = express.Router()

const requireAuth = passport.authenticate("jwt", { session: false })

router.get("/:id", decodeToken, requireAuth, getProfile)

router.patch("/:followedId/follow", decodeToken, requireAuth, followUser)
router.patch("/:followedId/unfollow", decodeToken, requireAuth, unfollowUser)

module.exports = router
