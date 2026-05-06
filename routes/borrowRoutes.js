import express from "express";
import {
  reserveBook,
  getMyReservedBooks,
  borrowBook,
  returnBook,
  getMyBorrowedBooks,
  getMyReturnedBooks,
  getMyHistory,
} from "../controllers/borrowController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- BORROW SYSTEM ---------- */

// Actions
router.post("/reserve", protect, reserveBook);
router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);

// User data
router.get("/reserved", protect, getMyReservedBooks);
router.get("/borrowed", protect, getMyBorrowedBooks);
router.get("/returned", protect, getMyReturnedBooks);
router.get("/history", protect, getMyHistory);

export default router;