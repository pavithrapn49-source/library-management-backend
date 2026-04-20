import express from "express";
import { getBooks, addBook, reserveBook } from "../controllers/bookController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all books
router.get("/", protect, getBooks);

// Add book (Admin only)
router.post("/add", protect, authorizeRoles("admin"), addBook);

// Reserve book
router.post("/reserve/:id", protect, reserveBook);

export default router;
