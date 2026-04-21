import express from "express";
import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getBorrowHistory,
  getMyDues,
  payFine,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Borrow / Return */
router.post("/borrow/:id", protect, borrowBook);
router.post("/return/:id", protect, returnBook);

/* Dashboard Data */
router.get("/my-borrows", protect, getMyBorrows);
router.get("/history", protect, getBorrowHistory);
router.get("/dues", protect, getMyDues);

/* Pay Fine */
router.post("/pay-fine/:id", protect, payFine);

export default router;