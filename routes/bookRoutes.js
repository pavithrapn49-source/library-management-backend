import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  reserveBook,
  getReservedBooks,
  claimReservedBook,
  cancelReservation
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBooks);
router.get("/:id", protect, getBookById);

router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

router.post("/reserve/:id", protect, reserveBook);
router.get("/reserved/my", protect, getReservedBooks);

/* NEW */
router.post("/claim/:id", protect, claimReservedBook);
router.post("/cancel-reserve/:id", protect, cancelReservation);

export default router;