import Book from "../models/book.js";

/* =====================================
   GET BOOKS (Search + Filter + Sort + Pagination)
===================================== */
export const getBooks = async (req, res) => {
  try {
    const {
      search = "",
      author = "",
      genre = "",
      available = "",
      sort = "",
      page = 1,
      limit = 6,
    } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }

    if (available === "true") {
      query.available = true;
    }

    if (available === "false") {
      query.available = false;
    }

    let sortOption = {};

    if (sort === "az") sortOption.title = 1;
    if (sort === "za") sortOption.title = -1;
    if (sort === "latest") sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.status(200).json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalBooks: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   ADD BOOK
===================================== */
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, price } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      price,
      available: true,
      borrowedBy: null,
      borrowedAt: null,
      returnedAt: null,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   BORROW BOOK (NEW - IMPORTANT)
===================================== */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available) {
      return res.status(400).json({ message: "Book already borrowed" });
    }

    book.available = false;
    book.borrowedBy = req.user.id;
    book.borrowedAt = new Date();

    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   RETURN BOOK (FIXED)
===================================== */
export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.available = true;
    book.borrowedBy = null;
    book.returnedAt = new Date();

    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   RESERVE BOOK (FIXED - REAL VERSION)
===================================== */
export const reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.available) {
      return res.status(400).json({
        message: "Book is available. You can borrow directly.",
      });
    }

    // real reservation logic
    book.reservedBy = req.user.id;
    book.reservedAt = new Date();

    await book.save();

    res.status(200).json({
      message: `Book "${book.title}" reserved successfully`,
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};