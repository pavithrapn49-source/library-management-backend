import express from "express";
import Book from "../models/book.js";

const router = express.Router();

/* =========================
   TEST ROUTE
   ========================= */
router.get("/test", (req, res) => {
  res.json({ message: "Books route working" });
});

/* =========================
   GET ALL BOOKS
   ========================= */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

/* =========================
   GET BOOK BY ID
   ========================= */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(400).json({ error: "Invalid book ID" });
  }
});

/* =========================
   ADD NEW BOOK
   ========================= */
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   UPDATE BOOK DETAILS
   ========================= */
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook)
      return res.status(404).json({ error: "Book not found" });

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

/* =========================
   DELETE BOOK
   ========================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
