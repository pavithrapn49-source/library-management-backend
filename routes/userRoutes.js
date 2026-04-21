import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, getProfile);

/* ADMIN */
router.get("/", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);

export default router;
