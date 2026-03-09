import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getBooks,
  addBook,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", protect, getBooks);

router.post("/", protect, addBook);

router.put("/:id", protect, updateBook);  // update book

router.delete("/:id", protect, deleteBook);

export default router;