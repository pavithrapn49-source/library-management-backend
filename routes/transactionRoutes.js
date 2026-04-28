import express from "express";
import {
  borrowBook,
  returnBook,
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

router.post("/borrow/:id", protect, borrowBook);
router.post("/return/:id", protect, returnBook);

router.get("/my-borrows", protect, getMyBorrows);
router.get("/history", protect, getBorrowHistory);
router.get("/dues", protect, getMyDues);

router.post("/pay-fine/:id", protect, payFine);

/* ADMIN */
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTransactions
);

export default router;