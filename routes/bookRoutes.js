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

import upload
from "../middleware/upload.js";

const router =
  express.Router();

/* ================= BOOK ROUTES ================= */

/* GET ALL BOOKS */

router.get(
  "/",
  protect,
  getBooks
);

router.post(
  "/:id/review",
  protect,
  addBookReview
);

/* GET SINGLE BOOK */

router.get(
  "/:id",
  protect,
  getBookById
);

/* ADD BOOK */

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("coverImage"),
  addBook
);

/* UPDATE BOOK */

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("coverImage"),
  updateBook
);

/* DELETE BOOK */

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBook
);

/* JOIN RESERVATION QUEUE */

router.post(
  "/:id/join-queue",
  protect,
  joinReservationQueue
);

/* RESERVED FOR USER */

router.get(
  "/reserved/me",
  protect,
  getReservedForUser
);

export default router;