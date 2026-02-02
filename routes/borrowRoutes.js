import express from "express";
import protect from "../middleware/authMiddleware.js";
import Borrow from "../models/borrow.js";

const router = express.Router();

router.get("/my", protect, async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user.id })
      .populate("book");

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
