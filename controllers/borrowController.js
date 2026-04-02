import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

// ================= BORROW BOOK =================
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ✅ Check if already borrowed by ANYONE
    const activeBorrow = await Borrow.findOne({
      book: book._id,
      returned: false,
    });

    if (activeBorrow) {
      return res.status(400).json({
        message: "Book already borrowed",
      });
    }

    // ✅ Prevent same user duplicate borrow
    const existingUserBorrow = await Borrow.findOne({
      book: book._id,
      user: req.user.id,
      returned: false,
    });

    if (existingUserBorrow) {
      return res.status(400).json({
        message: "You already borrowed this book",
      });
    }

    const borrow = await Borrow.create({
      user: req.user.id,
      book: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json(borrow);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RETURN BOOK =================
export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
      });
    }

    if (borrow.returned) {
      return res.status(400).json({
        message: "Already returned",
      });
    }

    // ✅ Set return info
    borrow.returned = true;
    borrow.returnDate = new Date();

    // ✅ Calculate fine
    const today = new Date();
    if (today > borrow.dueDate) {
      const daysLate = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );
      borrow.fine = daysLate * 10; // ₹10 per day
    }

    await borrow.save();

    // ================= HANDLE RESERVATION =================
    const book = await Book.findById(borrow.book);

    if (book?.reservedBy) {
      // ✅ Auto assign to reserved user
      await Borrow.create({
        user: book.reservedBy,
        book: book._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      book.reservedBy = null;
      await book.save();
    }

    res.json({
      message: "Book returned successfully",
      fine: borrow.fine || 0,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MY BORROWS =================
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user.id,
      returned: false,
    }).populate("book");

    res.json(borrows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= BORROW HISTORY (NEW) =================
export const getBorrowHistory = async (req, res) => {
  try {
    const history = await Borrow.find({
      user: req.user.id,
    }).populate("book");

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};