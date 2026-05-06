import Borrow from "../models/Borrow.js";
import Book from "../models/book.js";

/* ================= RESERVE BOOK ================= */
export const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // ❗ prevent duplicate reserve
    const existing = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: "reserved",
    });

    if (existing) {
      return res.status(400).json({ message: "Already reserved" });
    }

    const record = await Borrow.create({
      user: req.user._id,
      book: bookId,
      status: "reserved",
      reservedAt: new Date(),
    });

    // ❗ DO NOT reduce copies here

    res.json({ message: "Reserved successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET RESERVED ================= */
export const getMyReservedBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user._id,
      status: "reserved",
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // ❗ prevent duplicate borrow
    const alreadyBorrowed = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ message: "Already borrowed" });
    }

    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      status: "borrowed",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ✅ reduce copies
    book.availableCopies -= 1;
    await book.save();

    res.json({ message: "Book borrowed", borrow });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId).populate("book");
    if (!borrow) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (borrow.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    let fine = 0;
    const today = new Date();

    if (borrow.dueDate && today > borrow.dueDate) {
      const diffDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );
      fine = diffDays * 10;
    }

    borrow.status = "returned";
    borrow.returnDate = today;
    borrow.fine = fine;
    await borrow.save();

    // ✅ increase copies
    const book = await Book.findById(borrow.book._id);
    book.availableCopies += 1;
    await book.save();

    res.json({ message: "Book returned", fine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BORROWED ================= */
export const getMyBorrowedBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user._id,
      status: "borrowed",
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET RETURNED ================= */
export const getMyReturnedBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user._id,
      status: "returned",
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= FULL HISTORY ================= */
export const getMyHistory = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user._id,
    })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};