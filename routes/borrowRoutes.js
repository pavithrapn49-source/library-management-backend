import express from "express";
import {
  reserveBook,
  getMyReservedBooks,
  borrowBook,
  returnBook,
  getMyBorrowedBooks, 
    getMyHistory,} from "../controllers/borrowController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getMyReturnedBooks } from "../controllers/borrowController.js";



const router = express.Router();

router.post("/reserve", protect, reserveBook);
router.get("/my-reserved", protect, getMyReservedBooks);
router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);
router.get("/my-borrowed", protect, getMyBorrowedBooks);
router.get("/my-history", protect, getMyHistory);
router.get("/my-returned", protect, getMyReturnedBooks);

export default router;