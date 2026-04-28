import express from "express";
import {
  borrowBook,
  returnBook,
  renewBook,
  getMyBorrows,
  getBorrowHistory,
  getMyDues,
  payFine,
  getAllTransactions
} from "../controllers/transactionController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================
   MEMBER ROUTES
===================================== */

// Borrow book
router.post(
  "/borrow/:id",
  protect,
  borrowBook
);

// Return by transaction id
router.post(
  "/return/:id",
  protect,
  returnBook
);

// Renew borrowed book
router.post(
  "/renew/:id",
  protect,
  renewBook
);

// My active borrows
router.get(
  "/my-borrows",
  protect,
  getMyBorrows
);

// My full history
router.get(
  "/history",
  protect,
  getBorrowHistory
);

// My unpaid dues
router.get(
  "/dues",
  protect,
  getMyDues
);

// Pay fine
router.post(
  "/pay-fine/:id",
  protect,
  payFine
);

/* =====================================
   ADMIN ROUTES
===================================== */

// All transactions
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTransactions
);

export default router;