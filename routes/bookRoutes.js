import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getBooks,
  addBook,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";
import { reserveBook } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);

router.post("/", protect, addBook);

router.put("/:id", protect, updateBook);  // update book

router.delete("/:id", protect, deleteBook);

router.post("/reserve/:id", protect, reserveBook);

export default router;