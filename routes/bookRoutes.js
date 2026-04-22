import express from "express";
import {
  getBooks,
  addBook,
  reserveBook,
} from "../controllers/bookController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================
   GET ALL BOOKS
   Protected Route
   Supports:
   search
   author
   genre
   available
   sort
   page
===================================== */
router.get("/", protect, getBooks);

/* If frontend uses /all */
router.get("/all", protect, getBooks);

/* =====================================
   ADD BOOK
   Admin Only
===================================== */
router.post(
  "/add",
  protect,
  authorizeRoles("admin"),
  addBook
);

/* =====================================
   RESERVE BOOK
===================================== */
router.post(
  "/reserve/:id",
  protect,
  reserveBook
);

export default router;