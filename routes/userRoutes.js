import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  deleteUser,
  updateUserRole
} from "../controllers/userController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* USER */
router.get("/me", protect, getProfile);

/* ADMIN */
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

export default router;