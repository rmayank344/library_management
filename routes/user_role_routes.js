const express = require('express');
const router = new express.Router();
const { borrowed_book, get_borrowed_book, returned_book } = require('../controller/user_role_cntrll');

const {token_validate} = require("../middleware/token_validate");

// User Borrowed Book Routes
router.post("/borrowed_book", token_validate, borrowed_book);

// User Get Borrowed Book Routes
router.get("/get_borrowed_book", token_validate, get_borrowed_book);

// User Returned Book Routes
router.put("/returned_book", token_validate, returned_book);

module.exports = router;