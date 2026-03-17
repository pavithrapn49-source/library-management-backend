import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

// BORROW BOOK
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // check if already borrowed (ACTIVE only)
    const existingBorrow = await Borrow.findOne({
      book: book._id,
      returned: false,
    });

    if (existingBorrow) {
      return res.status(400).json({ message: "Book already borrowed" });
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
    const borrow = await Borrow.findOne({
      _id: req.params.id,
      user: req.user.id,
      returned: false,
    });

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    const book = await Book.findById(borrow.book);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ✅ Reset book
    book.borrowed = false;
    book.availabilityStatus = true;
    book.borrowedBy = null;
    book.dueDate = null;
    book.reservedBy = null;

    await book.save();

    // ✅ Update borrow
    borrow.status = "returned";
    await borrow.save();

    res.json({
      message: "Book returned successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error returning book"
    });
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