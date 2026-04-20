import express from "express";
import {
  addReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a review
router.post("/add", protect, addReview);

// Get reviews for a specific book
router.get("/:bookId", protect, getReviews);

// Get reviews written by the logged-in user
router.get("/my", protect, getMyReviews);

// Update a review
router.put("/:id", protect, updateReview);

// Delete a review
router.delete("/:id", protect, deleteReview);

export default router;
