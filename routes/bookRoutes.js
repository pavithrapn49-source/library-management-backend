import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  reserveBook,
  getReservedBooks
} from "../controllers/bookController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL BOOKS */
router.get("/", protect, getBooks);

/* GET SINGLE BOOK */
router.get("/:id", protect, getBookById);

/* ADD BOOK */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  addBook
);

/* UPDATE BOOK */
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateBook
);

/* DELETE BOOK */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteBook
);

/* RESERVE */
router.post(
  "/reserve/:id",
  protect,
  reserveBook
);

/* MY RESERVED */
router.get(
  "/reserved/my",
  protect,
  getReservedBooks
);

export default router;