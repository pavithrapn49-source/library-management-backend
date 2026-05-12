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

/* RESERVE */
router.post(
  "/reserve",
  protect,
  reserveBook
);

/* RESERVED BOOKS */
router.get(
  "/reserved",
  protect,
  getMyReservedBooks
);

/* BORROW */
router.post(
  "/borrow",
  protect,
  borrowBook
);

/* RETURN */
router.post(
  "/return",
  protect,
  returnBook
);

/* MY BORROWED */
router.get(
  "/borrowed",
  protect,
  getMyBorrowedBooks
);

/* MY RETURNED */
router.get(
  "/returned",
  protect,
  getMyReturnedBooks
);

/* HISTORY */
router.get(
  "/history",
  protect,
  getMyHistory
);

/* ADMIN */
router.get(
  "/all",
  protect,
  adminOnly,
  getAllTransactions
);

export default router;