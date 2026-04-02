import Book from "../models/book.js";
import Borrow from "../models/borrow.js";

// ================= ADD BOOK =================
export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    res.status(201).json({
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to add book" });
  }
};

// ================= GET BOOKS =================
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    // ✅ Get all active borrows in ONE query (performance fix)
    const activeBorrows = await Borrow.find({ returned: false });

    const borrowedBookIds = activeBorrows.map((b) =>
      b.book.toString()
    );

    const updatedBooks = books.map((book) => ({
      ...book._doc,
      available: !borrowedBookIds.includes(book._id.toString()),
      isReserved: !!book.reservedBy,
    }));

    res.json(updatedBooks);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// ================= UPDATE =================
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Book updated",
      updatedBook,
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE =================
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= RESERVE =================
export const reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // ✅ Check if book is currently borrowed
    const activeBorrow = await Borrow.findOne({
      book: book._id,
      returned: false,
    });

    if (!activeBorrow) {
      return res.status(400).json({
        message: "Book is available. You can borrow it.",
      });
    }

    // ✅ Prevent same user reserving again
    if (book.reservedBy?.toString() === req.user.id) {
      return res.status(400).json({
        message: "You already reserved this book",
      });
    }

    // ✅ Check if already reserved by someone else
    if (book.reservedBy) {
      return res.status(400).json({
        message: "Book already reserved by another user",
      });
    }

    book.reservedBy = req.user.id;
    await book.save();

    res.json({
      message: "Book reserved successfully",
      book,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};