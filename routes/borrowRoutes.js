import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import Book from "../models/book.js";
import Borrow from "../models/borrow.js";
import {
  returnBook,
  myBorrows,
  getAllBorrows
} from "../controllers/borrowController.js";

const router = express.Router();

/**
 * BORROW BOOK
 * POST /api/borrow
 */
router.post("/", protect, async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book not available" });
    }

    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      borrowedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      returned: false,
    });

    book.available = false;
    await book.save();

    res.json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * RETURN BOOK
 * PUT /api/borrow/return/:borrowId
 */
router.put("/return/:borrowId", protect, returnBook);

/**
 * USER BORROW HISTORY
 * GET /api/borrow/my
 */
router.get("/my", protect, myBorrows);

/**
 * ADMIN: VIEW ALL BORROWS
 * GET /api/borrow/all
 */
router.get("/all", protect, admin, getAllBorrows);

export default router;
