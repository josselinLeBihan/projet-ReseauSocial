const express = require("express");

const avatarUpload = require("../middlewares/user/avatarUpload");

const decodeToken = require("../middlewares/auth/decodeToken");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });

const { getUser, updateInfo } = require("../controllers/user.controller");

const router = express.Router();

router.get("/:id", getUser);
router.put("/:userId", decodeToken, requireAuth, avatarUpload, updateInfo);

module.exports = router;
