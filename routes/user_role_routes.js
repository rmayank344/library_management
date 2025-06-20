const express = require('express');
const router = new express.Router();
const { borrowed_book, get_borrowed_book } = require('../controller/user_role_cntrll');

const {token_validate} = require("../middleware/token_validate");

// User Borrowed Book Routes
router.post("/borrowed_book", token_validate, borrowed_book);

// User Get Borrowed Book Routes
router.get("/get_borrowed_book", token_validate, get_borrowed_book);

module.exports = router;