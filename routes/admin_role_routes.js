const express = require('express');
const router = new express.Router();
const { add_book,
   all_book, 
   edit_book, 
   admin_dashboard,
   all_user_details
   } = require('../controller/admin_role_cntrll');

const {token_validate, isAdmin} = require("../middleware/token_validate");

//All Book Routes
router.get("/all_book", all_book);

// Admin Adding Book Routes
router.post("/add_book", token_validate, isAdmin, add_book);

// Admin Edit Book Routes
router.put("/edit_book", token_validate, isAdmin, edit_book);

// Admin Book Status
router.get("/book_status", token_validate, isAdmin, admin_dashboard);

// All User detail
router.get('/all_users', token_validate, isAdmin, all_user_details);

module.exports = router;