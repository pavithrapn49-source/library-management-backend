import Transaction from "../models/Transaction.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (!book.available) {
      return res.status(400).json({
        message: "Book not available"
      });
    }

    const alreadyBorrowed = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      status: "borrowed"
    });

    if (alreadyBorrowed) {
      return res.status(400).json({
        message: "Already borrowed"
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      book: book._id,
      borrowDate: new Date(),
      dueDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      status: "borrowed",
      fine: 0,
      finePaid: false
    });

    book.available = false;
    book.borrowedBy = req.user._id;
    book.borrowedAt = new Date();

    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({
        message: "Already returned"
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
    }

    await transaction.save();

    const book = await Book.findById(transaction.book);

    if (book) {
      book.available = true;
      book.borrowedBy = null;
      book.returnedAt = new Date();

      /* auto assign reserved */
      if (book.reservedBy) {
        book.available = false;
        book.borrowedBy = book.reservedBy;
        book.borrowedAt = new Date();
        book.reservedBy = null;
        book.reservedAt = null;
      }

      await book.save();
    }

    res.json({
      message: "Returned successfully",
      fine: transaction.fine
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= RENEW ================= */
export const renewBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    if (transaction.status !== "borrowed") {
      return res.status(400).json({
        message: "Only active books can renew"
      });
    }

    transaction.dueDate = new Date(
      transaction.dueDate.getTime() +
      7 * 24 * 60 * 60 * 1000
    );

    await transaction.save();

    res.json({
      message: "Renewed successfully",
      dueDate: transaction.dueDate
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= MY BORROWS ================= */
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Transaction.find({
      user: req.user._id,
      status: "borrowed"
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(borrows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= HISTORY ================= */
export const getBorrowHistory = async (req, res) => {
  try {
    const history = await Transaction.find({
      user: req.user._id
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= DUES ================= */
export const getMyDues = async (req, res) => {
  try {
    const dues = await Transaction.find({
      user: req.user._id,
      fine: { $gt: 0 },
      finePaid: false
    }).populate("book");

    res.json(dues);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= PAY FINE ================= */
export const payFine = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    transaction.finePaid = true;
    await transaction.save();

    res.json({
      message: "Fine paid successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= ADMIN ================= */
export const getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("user", "name email role")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};