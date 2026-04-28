import Transaction from "../models/Transaction.js";
import Book from "../models/book.js";

/* ================= BORROW ================= */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "Book unavailable. Please reserve it.",
      });
    }

    const alreadyBorrowed = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return res.status(400).json({
        message: "Already borrowed",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      book: book._id,
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RETURN ================= */
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (
      transaction.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({
        message: "Already returned",
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
      book.availableCopies += 1;
      await book.save();
    }

    res.json({
      message: "Returned successfully",
      fine: transaction.fine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MY BORROWS ================= */
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
    res.status(500).json({ message: error.message });
  }
};

/* ================= HISTORY ================= */
export const getBorrowHistory = async (req, res) => {
  try {
    const history = await Transaction.find({
      user: req.user._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DUES ================= */
export const getMyDues = async (req, res) => {
  try {
    const dues = await Transaction.find({
      user: req.user._id,
      fine: { $gt: 0 },
      finePaid: false,
    }).populate("book");

    res.json(dues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= PAY FINE ================= */
export const payFine = async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    );

    if (!transaction)
      return res.status(404).json({
        message: "Not found",
      });

    transaction.finePaid = true;
    await transaction.save();

    res.json({
      message: "Fine paid successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN ================= */
export const getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renewBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (
      transaction.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (transaction.status !== "borrowed") {
      return res.status(400).json({
        message: "Only active borrowed books can be renewed",
      });
    }

    if (transaction.renewCount >= 1) {
      return res.status(400).json({
        message: "Renew limit reached",
      });
    }

    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    transaction.dueDate = newDueDate;
    transaction.renewCount += 1;

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