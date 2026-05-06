import express from "express";
import {
  reserveBook,
  getMyReservedBooks,
  borrowBook,
  returnBook,
  getMyBorrowedBooks, 
    getHistory,} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveBook);
router.get("/my-reserved", protect, getMyReservedBooks);
router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);
router.get("/my-borrowed", protect, getMyBorrowedBooks);
router.get("/history", protect, getHistory);
export default router;