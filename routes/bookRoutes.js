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
  cancelReservation,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- STATIC ROUTES FIRST ---------- */

router.get("/", protect, getBooks);

router.get(
  "/reserved/my",
  protect,
  getReservedBooks
);

router.post(
  "/reserve/:id",
  protect,
  reserveBook
);

router.post(
  "/claim/:id",
  protect,
  claimReservedBook
);

router.post(
  "/cancel-reserve/:id",
  protect,
  cancelReservation
);

/* ---------- ADMIN CRUD ---------- */

router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

/* ---------- DYNAMIC LAST ---------- */

router.get("/:id", protect, getBookById);

export default router;