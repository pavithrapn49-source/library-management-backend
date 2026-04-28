import Book from "../models/book.js";

/* ================= GET ALL BOOKS ================= */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE BOOK ================= */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADD BOOK ================= */
export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      price
    } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      available: true
    });

    res.status(201).json({
      message: "Book added successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE BOOK ================= */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book updated",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE BOOK ================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    await book.deleteOne();

    res.json({
      message: "Book deleted"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESERVE BOOK ================= */
export const reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.available) {
      return res.status(400).json({
        message: "Book is available. Borrow directly."
      });
    }

    if (
      book.reservedBy &&
      book.reservedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({
        message: "Already reserved by another user"
      });
    }

    book.reservedBy = req.user._id;
    book.reservedAt = new Date();

    await book.save();

    res.json({
      message: "Book reserved successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MY RESERVED BOOKS ================= */
export const getReservedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      reservedBy: req.user._id
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};