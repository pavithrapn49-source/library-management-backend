// routes/paymentRoutes.js
import express from "express";
import { createOrder } from "../controllers/paymentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", verifyUser, createOrder);

export default router;
