import Transaction from "../models/Transaction.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (!book.available) {
      return res.status(400).json({
        message: "Book not available",
      });
    }

    // prevent duplicate active borrow
    const existing = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      status: "borrowed",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already borrowed this book",
      });
    }

    // create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      book: book._id,
      status: "borrowed",
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      fine: 0,
      finePaid: false,
    });

    // update book
    book.available = false;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      transaction,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    transaction.status = "returned";
    transaction.returnDate = new Date();

    // calculate fine
    const today = new Date();

    if (today > transaction.dueDate) {
      const lateDays = Math.ceil(
        (today - transaction.dueDate) / (1000 * 60 * 60 * 24)
      );

      transaction.fine = lateDays * 10; // ₹10 per day
    }

    await transaction.save();

    // update book available
    const book = await Book.findById(transaction.book);

    if (book) {
      book.available = true;
      await book.save();
    }

    res.json({
      message: "Book returned successfully",
      fine: transaction.fine || 0,
      transaction,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= MY CURRENT BORROWS ================= */
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Transaction.find({
      user: req.user._id,
      status: "borrowed",
    }).populate("book");

    res.json(borrows);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= BORROW HISTORY ================= */
export const getBorrowHistory = async (req, res) => {
  try {
    const history = await Transaction.find({
      user: req.user._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= MY DUES ================= */
export const getMyDues = async (req, res) => {
  try {
    const dues = await Transaction.find({
      user: req.user._id,
      fine: { $gt: 0 },
      finePaid: false,
    }).populate("book");

    res.json(dues);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= PAY FINE ================= */
export const payFine = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    transaction.finePaid = true;
    await transaction.save();

    res.json({
      message: "Fine paid successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};