import express from "express";

import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  reserveBook,
  getReservedBooks,
  claimReservedBook
} from "../controllers/bookController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= BOOKS ================= */

router.get("/", protect, getBooks);

router.get("/:id", protect, getBookById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  addBook
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateBook
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteBook
);

/* ================= MEMBER ================= */

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

router.get(
  "/reserved/my",
  protect,
  getReservedBooks
);

export default router;