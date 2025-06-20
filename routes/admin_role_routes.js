const express = require('express');
const router = new express.Router();
const { add_book, all_book, edit_book } = require('../controller/admin_role_cntrll');

const {token_validate} = require("../middleware/token_validate");

//All Book Routes
router.get("/all_book", all_book);

// Admin Adding Book Routes
router.post("/add_book", token_validate, add_book);

// Admin Edit Book Routes
router.put("/edit_book", token_validate, edit_book);

module.exports = router;