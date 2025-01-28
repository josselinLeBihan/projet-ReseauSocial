const express = require("express");

const { signup, signin, logout} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

module.exports = router;
