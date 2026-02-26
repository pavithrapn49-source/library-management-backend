import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBooks,
  addBook,
  deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", protect, getBooks);
router.post("/", protect, addBook);
router.delete("/:id", protect, deleteBook);

export default router;