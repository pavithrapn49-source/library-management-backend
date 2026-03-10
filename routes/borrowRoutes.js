import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getMyBorrows } from "../controllers/borrowController.js";


const router = express.Router();

router.post("/:id", protect, authorizeRoles("member"), borrowBook);
router.put("/return/:borrowId", protect, authorizeRoles("member"), returnBook);
router.get("/my-borrows", protect, getMyBorrows);
export default router;