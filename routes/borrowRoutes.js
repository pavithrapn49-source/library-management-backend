import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getBorrowHistory // ✅ NEW
} from "../controllers/borrowController.js";

const router = express.Router();

// ================= BORROW =================
router.post("/:id", protect, borrowBook);

// ================= RETURN =================
router.put("/return/:id", protect, returnBook);

// ================= ACTIVE BORROWS =================
router.get("/my-borrows", protect, getMyBorrows);

// ================= HISTORY (NEW FEATURE) =================
router.get("/history", protect, getBorrowHistory);

export default router;