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

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= RESERVE BOOK ================= */

router.post(
  "/reserve",
  protect,
  reserveBook
);

/* ================= RESERVED BOOKS ================= */

router.get(
  "/reserved",
  protect,
  getMyReservedBooks
);

/* ================= BORROW BOOK ================= */

router.post(
  "/borrow",
  protect,
  borrowBook
);

/* ================= RETURN BOOK ================= */

router.post(
  "/return",
  protect,
  returnBook
);

/* ================= MY BORROWED ================= */

router.get(
  "/my-borrows",
  protect,
  getMyBorrowedBooks
);

/* ================= MY RETURNED ================= */

router.get(
  "/returned",
  protect,
  getMyReturnedBooks
);

/* ================= MY HISTORY ================= */

router.get(
  "/history",
  protect,
  getMyHistory
);

/* ================= ADMIN TRANSACTIONS ================= */

router.get(
  "/all",
  protect,
  adminOnly,
  getAllTransactions
);

export default router;