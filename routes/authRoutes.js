import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser
} from "../controllers/authController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ ADMIN ONLY
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

export default router;