import express from "express";
import {
  addReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= MY REVIEWS ================= */
/* keep this BEFORE /:bookId */
router.get("/my", protect, getMyReviews);

/* ================= ADD REVIEW ================= */
router.post("/add", protect, addReview);

/* ================= GET REVIEWS OF BOOK ================= */
router.get("/:bookId", protect, getReviews);

/* ================= UPDATE REVIEW ================= */
router.put("/:id", protect, updateReview);

/* ================= DELETE REVIEW ================= */
router.delete("/:id", protect, deleteReview);

export default router;