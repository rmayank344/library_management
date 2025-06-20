const express = require("express");
const router = new express.Router();

const { user_registration, user_login } = require("../controller/user_register");

// User Registration Routes
router.post("/register", user_registration);

// User Login Routes
router.get("/login", user_login);

module.exports = router;