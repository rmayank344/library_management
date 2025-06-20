const BookModel = require('../models/book_model');
const TransactionModel = require('../models/transaction_model');
const USER_MODEL = require('../models/user_model');
const { Op } = require("sequelize");

// User Borrowed Book API
const borrowed_book = async (req, res) => {
  try {
    const userId = req.id;
    const { bookId } = req.body;

    if (req.role == 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only user can borrowed book.",
      });
    }

    const total_borrowed_book = await TransactionModel.count({
      where: { userId: userId, status: "borrowed" },
      raw: true,
    });

    if (total_borrowed_book == 5) {
      return res.status(400).json({
        success: false,
        message: "A user can only borrow 5 books at a time"
      });
    }

    const already_borrowed_book = await TransactionModel.findOne({
      where:
      {
        userId: userId,
        bookId: bookId,
        status: {
          [Op.ne]: "returned"
        }
      },
      raw: true
    });

    if (already_borrowed_book) {
      return res.status(400).json({
        success: false,
        message: "You have already borrowed this book"
      });
    }

    const check_book = await BookModel.findOne({ where: { id: bookId }, raw: true });

    if (!check_book || check_book.quantity == 0) {
      return res.status(400).json({
        success: false,
        message: "Book not found"
      });
    }

    const transaction_book = await TransactionModel.create({
      userId: userId,
      bookId: bookId,
      status: "borrowed"
    });

    await BookModel.update(
      { quantity: check_book.quantity - 1 },
      {
        where: {
          id: bookId
        }
      });

    return res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      borrowed_book: transaction_book
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

// User can see their Borrowed Book API
const get_borrowed_book = async (req, res) => {
  const userId = req.id;
  try {
    const all_borrowed_book = await TransactionModel.findAll(
      {
        where: { userId: userId, status: "borrowed" },
        raw: true,
      });

    if (all_borrowed_book.length == 0) {
      return res.status(400).json({
        success: false,
        message: "You have not borrowed any book"
      });
    }
    const user_name = await USER_MODEL.findOne({ where: { id: userId }, raw: true });

    const bookIds = all_borrowed_book.map(book => book.bookId);

    const books = await BookModel.findAll({
      where: { id: bookIds },
      raw: true,
    });

    const bookMap = new Map();
    books.forEach(book => {
      bookMap.set(book.id, book);
    });

    const book_data = all_borrowed_book.map(borrowed => {
      const book = bookMap.get(borrowed.bookId);
      return {
        title: book?.title,
        author: book?.author,
        quantity: 1,
      };
    });

    return res.status(200).json({
      success: true,
      name: user_name.name,
      borrowed_book: book_data
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

//User can returned the book
const returned_book = async (req, res) => {
  const userId = req.id;
  try {
    const { bookId } = req.body;

    const borrowed_book = await TransactionModel.findOne({
      where: { userId: userId, bookId: bookId, status: "borrowed" },
      raw: true
    });

    if (!borrowed_book) {
      return res.status(400).json({
        success: false,
        message: "You have not borrowed this book"
      });
    }
    await TransactionModel.update(
      {  status: "returned" },
      {
        where: {
          userId: userId,
          bookId: bookId,
          status: "borrowed"
        },
      });

    const book = await BookModel.findOne({ where: { id: bookId }, raw: true });

    await BookModel.update(
      { quantity: book.quantity + 1 },
      {
        where: {
          id: bookId
        }
      });

    return res.status(200).json({
      success: true,
      message: "Book returned successfully"
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};


module.exports = { borrowed_book, get_borrowed_book, returned_book };
