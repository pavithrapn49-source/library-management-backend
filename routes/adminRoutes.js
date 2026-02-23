import express from "express";
import {
  getDashboardStats,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get("/users", protect, authorize("admin"), getAllUsers);

export default router;
