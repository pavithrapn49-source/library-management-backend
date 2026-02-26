import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

export const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.borrowed) return res.status(400).json({ message: "Book already borrowed" });

    const borrow = await Borrow.create({ book: bookId, user: userId });
    book.borrowed = true;
    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      borrow: { id: borrow._id, book: book.title, user: req.user.name, borrowedAt: borrow.borrowedAt }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate("book");
    if (!borrow) return res.status(404).json({ message: "Borrow not found" });
    if (borrow.status === "returned") return res.status(400).json({ message: "Already returned" });

    borrow.status = "returned";
    await borrow.save();

    borrow.book.borrowed = false;
    await borrow.book.save();

    res.status(200).json({ message: "Book returned", borrow });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};