import Book from "../models/book.js";
import Borrow from "../models/borrow.js"; // ✅ FIXED

// ADD BOOK
export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: "Failed to add book" });
  }
};

// GET BOOKS (CORRECT AVAILABILITY)
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    const updatedBooks = await Promise.all(
      books.map(async (book) => {
        const activeBorrow = await Borrow.findOne({
          book: book._id,
          returned: false,
        });

        return {
          ...book._doc,
          available: !activeBorrow,
        };
      })
    );

    res.json(updatedBooks);
  } catch {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// UPDATE
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBook);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

// RESERVE
export const reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).json({ message: "Book not found" });

    const activeBorrow = await Borrow.findOne({
      book: book._id,
      returned: false,
    });

    if (!activeBorrow) {
      return res.status(400).json({
        message: "Book is available. You can borrow it.",
      });
    }

    if (book.reservedBy) {
      return res.status(400).json({
        message: "Book already reserved",
      });
    }

    if (book.reservedBy?.toString() === req.user.id) {
      return res.status(400).json({
        message: "You already reserved this book",
      });
    }

    book.reservedBy = req.user.id;
    await book.save();

    res.json({ message: "Book reserved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};