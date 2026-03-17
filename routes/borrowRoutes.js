import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  borrowBook,
  returnBook,
  getMyBorrows
} from "../controllers/borrowController.js";

const router = express.Router();

router.post("/:id", protect, borrowBook);

router.put("/return/:id", protect, returnBook);

router.get("/my-borrows", protect, getMyBorrows);

export default router;