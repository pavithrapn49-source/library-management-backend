import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id", protect, authorizeRoles("member"), borrowBook);
router.put("/return/:id", protect, authorizeRoles("member"), returnBook);

export default router;