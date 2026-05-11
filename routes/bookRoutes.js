import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getReservedForUser,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  joinReservationQueue,
} from "../controllers/bookController.js";

const router = express.Router();

/* ---------- BOOK ROUTES ONLY ---------- */

// Get all books
router.get("/", protect, getBooks);

// Get single book
router.get("/:id", protect, getBookById);

// Admin CRUD
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);
router.post(
  "/:id/join-queue",
  protect,
  joinReservationQueue
);
router.get(
  "/reserved/me",
  protect,
  getReservedForUser
);

export default router;