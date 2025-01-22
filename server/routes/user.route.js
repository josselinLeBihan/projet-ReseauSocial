const express = require("express");
const userCtrl = require("../controllers/user.controller");

const { signup, signin, logout } = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", userCtrl.signup);
router.post("/signin", userCtrl.signin);
//router.post("/logout", userCtrl.logout);

module.exports = router;
