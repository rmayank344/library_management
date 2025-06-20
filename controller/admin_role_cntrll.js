const USER_MODEL = require('../models/user_model');
const BookModel = require('../models/book_model');
const TransactionModel = require('../models/transaction_model');

// Admin Adding Book
const add_book = async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    if (!title || !author || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (req.role == 'admin') {
      const book = await BookModel.create({ title, author, quantity });
      return res.status(200).json({
        success: true,
        message: "Book added successfully",
        book
      });
    }
    else {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to add book."
      });
    }
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

// Show All Available Book
const all_book = async (req, res) => {
  try {
    const books = await BookModel.findAll({ raw: true });
    return res.status(200).json({
      success: true,
      book: books
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

//Admin can Edit Quantity of Book
const edit_book = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    if (req.role == 'admin') {
      const update_book = await BookModel.findOne({ where: { id: id }, raw: true });
      if (update_book) {
        await BookModel.update(
          { quantity: quantity },
          {
            where: {
              id: id
            },
          }
        );
        return res.status(200).json({
          success: true,
          message: "Book quantity updated successfully"
        });
      }
      else {
        return res.status(400).json({
          success: false,
          message: "Book not found"
        });
      }
    }
    else {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to add book."
      });
    }
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};


module.exports = { add_book, all_book, edit_book };
