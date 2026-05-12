import express from "express";

import {
  reserveBook,
  borrowBook,
  returnBook,
  getMyBorrowedBooks,
  getMyReservedBooks,
  getMyReturnedBooks,
  getMyHistory,
  getAllTransactions,
} from "../controllers/borrowController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= MEMBER ROUTES ================= */

/* borrow book */
router.post(
  "/borrow",
  protect,
  borrowBook
);

/* reserve book */
router.post(
  "/reserve",
  protect,
  reserveBook
);

/* return book */
router.post(
  "/return",
  protect,
  returnBook
);

/* borrowed books */
router.get(
  "/my-borrows",
  protect,
  getMyBorrowedBooks
);

/* reserved books */
router.get(
  "/my-reserved",
  protect,
  getMyReservedBooks
);

/* returned books */
router.get(
  "/my-returned",
  protect,
  getMyReturnedBooks
);

/* full history */
router.get(
  "/history",
  protect,
  getMyHistory
);

/* ================= ADMIN ================= */

/* all transactions */
router.get(
  "/all",
  protect,
  getAllTransactions
);

export default router;