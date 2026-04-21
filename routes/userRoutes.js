import express from "express";
import { registerUser, loginUser, logoutUser, getProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getProfile);

export default router;
