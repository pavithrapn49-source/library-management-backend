import express from "express";
import {registerUser,loginUser,getProfile,getAllUsers,deleteUser,updateUserRole,} from "../controllers/userController.js";
import {protect,authorizeRoles,} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);

/* ================= USER ROUTES ================= */

// Get Logged-in User Profile
router.get(
  "/me",
  protect,
  getProfile
);

/* ================= ADMIN + LIBRARIAN ================= */

// Get All Users
router.get(
  "/",
  protect,
  authorizeRoles(
    "admin",
    "librarian"
  ),
  getAllUsers
);

/* ================= ADMIN ONLY ================= */

// Delete User
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

// Update User Role
router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

export default router;