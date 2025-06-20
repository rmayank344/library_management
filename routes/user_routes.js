const express = require("express");
const router = new express.Router();

const { user_registration } = require("../controller/user_register");

// User Registration Routes
router.post("/register", user_registration);

module.exports = router;