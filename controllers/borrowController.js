import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

// ================= BORROW BOOK =================
export const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    if (book.borrowed)
      return res.status(400).json({ message: "Book already borrowed" });

    // Create borrow record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      book: bookId,
      user: userId,
      dueDate
    });

    book.borrowed = true;
    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      borrow
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RETURN BOOK =================
export const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const borrow = await Borrow.findOne({
      book: bookId,
      user: userId,
      status: "borrowed"
    });

    if (!borrow)
      return res.status(404).json({ message: "Borrow record not found" });

    borrow.status = "returned";
    await borrow.save();

    const book = await Book.findById(bookId);
    book.borrowed = false;
    await book.save();

    res.status(200).json({ message: "Book returned successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MY BORROWS =================
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user.id,
      status: "borrowed"
    }).populate("book");

    res.status(200).json(borrows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};