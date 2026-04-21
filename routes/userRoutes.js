import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public Routes */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* Logged-in User */
router.get("/me", protect, getProfile);

/* Admin Only */
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;