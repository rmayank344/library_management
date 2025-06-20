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

// Admin can see borrowed and returned book by user
const admin_dashboard = async (req, res) => {
  try {
    // If status == borrowed then it will show only borrowed book otherwise returned book
    const { status } = req.query;
    if (req.role == 'admin') {
      const book_status = await TransactionModel.findAll({
        where: { status: status },
        raw: true,
      });

      const uniqueUserIds = [...new Set(book_status.map(item => item.userId))];

      const user_detail = await USER_MODEL.findAll({
        where: {
          id: uniqueUserIds
        },
        attributes: ['id', 'name'],
        raw: true,
      });

      const user_map = new Map();
      user_detail.forEach(user => {
        user_map.set(user.id, user.name);
      });

      const bookId = book_status.map(item => item.bookId);

      const book_detail = await BookModel.findAll({
        where: {
          id: bookId,
        },
        attributes: ['id', 'title', 'author'],
        raw: true,
      });

      const book_map = new Map();
      book_detail.forEach(book => {
        book_map.set(book.id, {
          title: book.title,
          author: book.author,
        });
      });

      const userBookMap = new Map();

      book_status.forEach(entry => {
        const userId = entry.userId;

        const book_data = {
          book_id: entry.bookId,
          title: book_map.get(entry.bookId)?.title,
          author: book_map.get(entry.bookId)?.author,
          status: entry.status
        };

        if (!userBookMap.has(userId)) {
          userBookMap.set(userId, {
            userId: userId,
            user_name: user_map.get(userId),
            books: [book_data]
          });
        }
        else {
          userBookMap.get(userId).books.push(book_data);
        }
      });


      const finalResult = Array.from(userBookMap.values());
      return res.status(200).json({
        success: true,
        data: finalResult,
      });
    }
    else {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to show book status."
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

module.exports = { add_book, all_book, edit_book, admin_dashboard };
