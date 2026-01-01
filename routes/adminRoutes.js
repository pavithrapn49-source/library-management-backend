import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import Book from "../models/book.js";
import User from "../models/user.js";
import { adminStats } from "../controllers/adminController.js";

const router = express.Router();

/**
 * ADMIN DASHBOARD STATS
 * GET /api/admin/stats
 */
router.get("/stats", protect, admin, adminStats);

/**
 * GET ALL USERS
 * GET /api/admin/users
 */
router.get("/users", protect, admin, async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/**
 * GET ALL BOOKS
 * GET /api/admin/books
 */
router.get("/books", protect, admin, async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

/**
 * ADD BOOK
 * POST /api/admin/books
 */
router.post("/books", protect, admin, async (req, res) => {
  const { title, author, price } = req.body;
  const book = await Book.create({ title, author, price });
  res.status(201).json(book);
});

export default router;
