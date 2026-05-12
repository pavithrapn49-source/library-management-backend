import express from "express";

import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getReservedForUser,
  joinReservationQueue,
  addBookReview,
} from "../controllers/bookController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= GET ALL BOOKS ================= */

router.get(
  "/",
  protect,
  getBooks
);

/* ================= GET SINGLE BOOK ================= */

router.get(
  "/:id",
  protect,
  getBookById
);

/* ================= ADD BOOK ================= */

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("coverImage"),
  addBook
);

/* ================= UPDATE BOOK ================= */

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("coverImage"),
  updateBook
);

/* ================= DELETE BOOK ================= */

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBook
);

/* ================= ADD REVIEW ================= */

router.post(
  "/:id/review",
  protect,
  addBookReview
);

/* ================= JOIN RESERVATION QUEUE ================= */

router.post(
  "/:id/join-queue",
  protect,
  joinReservationQueue
);

/* ================= GET RESERVED BOOKS ================= */

router.get(
  "/reserved/me",
  protect,
  getReservedForUser
);

export default router;