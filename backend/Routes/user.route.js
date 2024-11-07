const express = require("express");
const { SignUp, Login, GetUser } = require("../controller/user.controller");
const { authenticateToken } = require("../utilities");

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/profile", authenticateToken, GetUser);

module.exports = router;
