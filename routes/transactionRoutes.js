import express from "express";
import { borrowBook, returnBook } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Borrow a book
router.post("/borrow/:id", protect, borrowBook);

// Return a book
router.post("/return/:id", protect, returnBook);

export default router;
