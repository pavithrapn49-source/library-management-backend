import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available) {
      return res.status(400).json({
        message: "Book already borrowed",
      });
    }

    const existing = await Borrow.findOne({
      user: req.user.id,
      book: book._id,
      returned: false,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already borrowed this book",
      });
    }

    const borrow = await Borrow.create({
      user: req.user.id,
      book: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ✅ UPDATE AVAILABILITY (ONLY ONCE)
    book.available = false;
    await book.save();

    return res.status(201).json({
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
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
      });
    }

    // 🔐 Prevent other users returning
    if (borrow.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (borrow.returned) {
      return res.status(400).json({
        message: "Already returned",
      });
    }

    borrow.returned = true;
    borrow.returnDate = new Date();

    // 💰 Fine calculation
    const today = new Date();
    if (today > borrow.dueDate) {
      const daysLate = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );
      borrow.fine = daysLate * 10;
    }

    await borrow.save();
const book = await Book.findById(borrow.book);

// ================= RESERVATION LOGIC =================
if (book?.reservedBy) {
  await Borrow.create({
    user: book.reservedBy,
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  book.reservedBy = null;
  book.available = false;
} else {
  book.available = true;
}

await book.save();
    res.json({
      message: "Book returned successfully",
      fine: borrow.fine || 0,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MY BORROWS ================= */
export const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user.id,
      returned: false,
    }).populate("book");

    res.json(borrows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= BORROW HISTORY ================= */
export const getBorrowHistory = async (req, res) => {
  try {
    const history = await Borrow.find({
      user: req.user.id,
    }).populate("book");

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};