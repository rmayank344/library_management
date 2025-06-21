const USER_MODEL = require('../models/user_model');
const BookModel = require('../models/book_model');
const TransactionModel = require('../models/transaction_model');

// Admin Adding Book
// Endpoint: http://localhost:4001/api/admin_role/add_book
const add_book = async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    if (!title || !author || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const book = await BookModel.create({ title, author, quantity });
    return res.status(200).json({
      success: true,
      message: "Book added successfully",
      book
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

// Show All Available Book
// Endpoint: http://localhost:4001/api/admin_role/all_book
const all_book = async (req, res) => {
  try {
    const books = await BookModel.findAll({
      where: { quantity: { [Op.gt]: 0 } },
      raw: true
    });
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
// Endpoint: http://localhost:4001/api/admin_role/edit_book
const edit_book = async (req, res) => {
  try {
    const { id, quantity } = req.body;

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
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

// Admin can see borrowed and returned book by user
// Endpoint: http://localhost:4001/api/admin_role/book_status
const admin_dashboard = async (req, res) => {
  try {
    // If status == borrowed then it will show only borrowed book otherwise returned book
    const { status } = req.query;
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
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

// Admin can show all user detail
// Endpoint: http://localhost:4001/api/admin_role/all_users
const all_user_details = async (req, res) => {
  try {
    const { id } = req.query;
    const all_user = await USER_MODEL.findOne({
      where: { id: id, role: "user" },
      attributes: ['name', 'email'],
      raw: true,
    });

    const borrow_book = await TransactionModel.findAll({
      where: {
        userId: id,
        status: "borrowed"
      },
      attributes: ['bookId', 'status'],
      raw: true,
    });

    if (borrow_book.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          ...all_user,
          books: []
        }
      });
    }

    const bookIds = borrow_book.map(book => book.bookId);
    const book_data = await BookModel.findAll({
      where: {
        id: bookIds
      },
      attributes: ['id', 'title', 'author'],
      raw: true,
    });

    const books = book_data.map(book => {
      const match = borrow_book.find(b => b.bookId === book.id);
      return {
        bookId: book.id,
        title: book.title,
        author: book.author,
        status: match ? match.status : "unknown"
      };
    });
    return res.status(200).json({
      success: true,
      data: {
        ...all_user,
        books
      }
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

module.exports = { add_book, all_book, edit_book, admin_dashboard, all_user_details };
