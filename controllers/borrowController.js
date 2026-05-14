import Borrow from "../models/Borrow.js";
import Book from "../models/book.js";

/* ================= RESERVE ================= */
export const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const exists = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: "reserved",
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Already reserved" });
    }

    const record = await Borrow.create({
      user: req.user._id,
      book: bookId,
      status: "reserved",
      reservedAt: new Date(),
    });

    book.reservationQueue.push(req.user._id);
    await book.save();

    res.json({ success: true, record });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/* ================= BORROW ================= */
export const borrowBook = async (req, res) => {
  try {

    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    /* NO COPIES */

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }

    /* ALREADY BORROWED */

    const exists = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: "borrowed",
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already borrowed",
      });
    }

    /* CREATE RECORD */

    const record = await Borrow.create({
      user: req.user._id,
      book: bookId,
      status: "borrowed",
      borrowDate: new Date(),
      dueDate: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

    /* UPDATE COPIES */

    book.availableCopies -= 1;

    /* UPDATE STATUS */

    if (book.availableCopies <= 0) {

      book.availableCopies = 0;

      book.status = "unavailable";

    } else {

      book.status = "available";

    }

    /* REMOVE USER FROM QUEUE */

    book.reservationQueue =
      book.reservationQueue.filter(
        (id) =>
          id.toString() !==
          req.user._id.toString()
      );

    await book.save();

    res.status(200).json({
      success: true,
      message:
        "Book borrowed successfully",
      record,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

/* ================= RETURN ================= */
export const returnBook = async (req, res) => {
  try {

    const { borrowId } = req.body;

    const borrow = await Borrow.findById(
      borrowId
    ).populate("book");

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    /* ALREADY RETURNED */

    if (borrow.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Already returned",
      });
    }

    let fine = 0;

    const today = new Date();

    /* CALCULATE FINE */

    if (
      borrow.dueDate &&
      today > borrow.dueDate
    ) {

      const days = Math.ceil(
        (today - borrow.dueDate) /
          (1000 * 60 * 60 * 24)
      );

      fine = days * 10;
    }

    /* UPDATE BORROW */

    borrow.status = "returned";

    borrow.returnDate = today;

    borrow.fine = fine;

    await borrow.save();

    /* UPDATE BOOK */

    const book = await Book.findById(
      borrow.book._id
    );

    book.availableCopies += 1;

    /* UPDATE STATUS */

    if (book.availableCopies > 0) {
      book.status = "available";
    }

    await book.save();

    res.status(200).json({
      success: true,
      message:
        "Book returned successfully",
      fine,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

/* ================= GET BORROWED ================= */
export const getMyBorrowedBooks = async (req, res) => {
  const records = await Borrow.find({
    user: req.user._id,
    status: "borrowed",
  }).populate("book");

  res.json({ success: true, records });
};

/* ================= GET RESERVED ================= */
export const getMyReservedBooks = async (req, res) => {
  const records = await Borrow.find({
    user: req.user._id,
    status: "reserved",
  }).populate("book");

  res.json({ success: true, records });
};

/* ================= GET RETURNED ================= */
export const getMyReturnedBooks = async (req, res) => {
  const records = await Borrow.find({
    user: req.user._id,
    status: "returned",
  }).populate("book");

  res.json({ success: true, records });
};

/* ================= HISTORY ================= */
export const getMyHistory = async (req, res) => {
  const records = await Borrow.find({
    user: req.user._id,
  }).populate("book");

  res.json({ success: true, records });
};

/* ================= ADMIN ================= */
export const getAllTransactions = async (req, res) => {
  const records = await Borrow.find()
    .populate("user", "name email")
    .populate("book", "title author")
    .sort({ createdAt: -1 });

  res.json({ success: true, records });
};