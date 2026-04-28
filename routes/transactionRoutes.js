import express from "express";
import {
  borrowBook,
  returnBook,
  renewBook,
  getMyBorrows,
  getBorrowHistory,
  getMyDues,
  payFine,
  getAllTransactions,
} from "../controllers/transactionController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= MEMBER ROUTES ================= */

// Borrow Book
router.post(
  "/borrow/:id",
  protect,
  borrowBook
);

// Return Book
router.post(
  "/return/:id",
  protect,
  returnBook
);

// Renew Book
router.post(
  "/renew/:id",
  protect,
  renewBook
);

// My Borrowed Books
router.get(
  "/my-borrows",
  protect,
  getMyBorrows
);

// My History
router.get(
  "/history",
  protect,
  getBorrowHistory
);

// My Pending Fines
router.get(
  "/dues",
  protect,
  getMyDues
);

// Pay Fine
router.post(
  "/pay-fine/:id",
  protect,
  payFine
);

/* ================= ADMIN ROUTES ================= */

// All Transactions
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTransactions
);

export default router;