import Book from "../models/book.js";

/* ================= GET ALL BOOKS ================= */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE BOOK ================= */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD BOOK ================= */
export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      price,
      isbn,
      totalCopies,
    } = req.body;

    const copies =
      Number(totalCopies) || 1;

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      isbn,
      totalCopies: copies,
      availableCopies: copies,
      available: true,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE BOOK ================= */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE BOOK ================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= RESERVE BOOK ================= */
export const reserveBook = async (
  req,
  res
) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Book available. Borrow directly.",
      });
    }

    if (
      book.reservedBy &&
      book.reservedBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Already reserved by another user",
      });
    }

    book.reservedBy = req.user._id;
    book.reservedAt = new Date();

    await book.save();

    res.status(200).json({
      success: true,
      message:
        "Book reserved successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= MY RESERVED BOOKS ================= */
export const getReservedBooks =
  async (req, res) => {
    try {
      const books = await Book.find({
        reservedBy: req.user._id,
      }).sort({
        reservedAt: -1,
      });

      res.status(200).json({
        success: true,
        books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };