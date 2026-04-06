import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getCurrentUser
} from "../controllers/authController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ================= */

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/me", protect, getCurrentUser);

/* ================= ADMIN ================= */

// Get all users (admin only)
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// Delete user (admin only)
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

export default router;