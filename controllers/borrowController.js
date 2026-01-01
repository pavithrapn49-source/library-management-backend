import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!book.available)
      return res.status(400).json({ message: "Book already borrowed" });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      dueDate,
      returned: false,
    });

    book.available = false;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId).populate("book");
    if (!borrow)
      return res.status(404).json({ message: "Borrow record not found" });

    if (borrow.returned)
      return res.status(400).json({ message: "Book already returned" });

    borrow.returned = true;
    borrow.returnedAt = new Date();

    // Fine calculation
    let fine = 0;
    if (borrow.dueDate && new Date() > borrow.dueDate) {
      const days =
        Math.ceil(
          (new Date() - borrow.dueDate) / (1000 * 60 * 60 * 24)
        );
      fine = days * 10; // ₹10/day
    }

    borrow.fine = fine;
    await borrow.save();

    borrow.book.available = true;
    await borrow.book.save();

    res.json({ message: "Book returned successfully", fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= USER BORROW HISTORY ================= */
export const myBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN: ALL BORROWS ================= */
export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
