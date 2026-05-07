import Book from "../models/book.js";
import Borrow from "../models/Borrow.js";

/* ================= HELPER: BOOK STATUS ================= */
const getBookStatus = (book, borrows) => {
  // Check if reserved
  const hasReserved = borrows.some(
    (b) => b.status === "reserved"
  );

  if (hasReserved) {
    return "reserved";
  }

  // Check if borrowed
  if (book.availableCopies <= 0) {
    return "borrowed";
  }

  // Default
  return "available";
};

/* ================= GET ALL BOOKS ================= */
export const getBooks = async (req, res) => {
  try {
    // Get all books
    const books = await Book.find().sort({
      createdAt: -1,
    });

    // Get only active borrow/reserve records
    const borrows = await Borrow.find({
      status: {
        $in: ["borrowed", "reserved"],
      },
    });

    // Attach dynamic status
    const updatedBooks = books.map((book) => {
      const relatedBorrows = borrows.filter(
        (b) =>
          b.book.toString() ===
          book._id.toString()
      );

      return {
        ...book.toObject(),

        status: getBookStatus(
          book,
          relatedBorrows
        ),
      };
    });

    res.status(200).json({
      success: true,
      count: updatedBooks.length,
      books: updatedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE BOOK ================= */
export const getBookById = async (
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

    // Get active records
    const borrows = await Borrow.find({
      book: book._id,
      status: {
        $in: ["borrowed", "reserved"],
      },
    });

    // Dynamic status
    const status = getBookStatus(
      book,
      borrows
    );

    res.status(200).json({
      success: true,

      book: {
        ...book.toObject(),
        status,
      },
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
      description,
      isbn,
      price,
      coverImage,
      totalCopies,
    } = req.body;

    const copies =
      Number(totalCopies) || 1;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      isbn,
      price,
      coverImage,

      totalCopies: copies,
      availableCopies: copies,
    });

    res.status(201).json({
      success: true,
      message:
        "Book added successfully",
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
export const updateBook = async (
  req,
  res
) => {
  try {
    const book =
      await Book.findByIdAndUpdate(
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
export const deleteBook = async (
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