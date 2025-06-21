const express = require("express");
const router = new express.Router();

const {token_validate} = require("../middleware/token_validate");

const { user_registration, user_login, edit_profile } = require("../controller/user_register");

// User Registration Routes
router.post("/register", user_registration);

// User Login Routes
router.get("/login", user_login);

// Profile Edit Routes
router.put("/edit_profile", token_validate, edit_profile);

module.exports = router;