import Transaction from "../models/Transaction.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

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

    const alreadyBorrowed = await Transaction.findOne({
      user: userId,
      book: bookId,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return res.status(400).json({
        message: "You already borrowed this book",
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const transaction = await Transaction.create({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      dueDate,
      status: "borrowed",
      fine: 0,
      finePaid: false,
    });

    book.available = false;
    book.borrowedBy = userId;
    book.borrowedAt = new Date();

    if (
      book.reservedBy &&
      book.reservedBy.toString() === userId.toString()
    ) {
      book.reservedBy = null;
      book.reservedAt = null;
    }

    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

    const today = new Date();

    if (today > transaction.dueDate) {
      const lateDays = Math.ceil(
        (today - transaction.dueDate) /
          (1000 * 60 * 60 * 24)
      );

      transaction.fine = lateDays * 10;
      transaction.finePaid = false;
    }

    await transaction.save();

    const book = await Book.findById(transaction.book);

    if (book) {
      book.available = true;
      book.borrowedBy = null;
      book.borrowedAt = null;
      book.returnedAt = new Date();

      await book.save();
    }

    res.json({
      message: "Book returned successfully",
      fine: transaction.fine,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= RENEW BOOK ================= */
export const renewBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.status !== "borrowed") {
      return res.status(400).json({
        message: "Only borrowed books can be renewed",
      });
    }

    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    transaction.dueDate = newDueDate;

    await transaction.save();

    res.json({
      message: "Book renewed successfully",
      dueDate: transaction.dueDate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= MY BORROWED BOOKS ================= */
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Transaction.find({
      user: req.user._id,
      status: "borrowed",
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= ADMIN ALL TRANSACTIONS ================= */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email role")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};