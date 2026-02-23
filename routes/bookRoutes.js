import express from "express";
import {
  addBook,
  getBooks,
  deleteBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getBooks);
router.post("/", protect, authorize("admin", "librarian"), addBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

export default router;
