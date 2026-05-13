import express from "express";
import {
  reserveBook,
  getMyReservedBooks,
  borrowBook,
  returnBook,
  getMyBorrowedBooks,
  getMyReturnedBooks,
  getMyHistory,
  getAllTransactions,
} from "../controllers/borrowController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveBook);
router.get("/reserved", protect, getMyReservedBooks);

router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);

router.get("/borrowed", protect, getMyBorrowedBooks);
router.get("/returned", protect, getMyReturnedBooks);
router.get("/history", protect, getMyHistory);

router.get("/transactions/all", protect, adminOnly, getAllTransactions);

export default router;