import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

/* ================= BORROW BOOK ================= */
export const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    if (book.borrowed)
      return res.status(400).json({ message: "Book already borrowed" });

    // Due date = 7 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      book: bookId,
      user: userId,
      dueDate
    });

    book.borrowed = true;
    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      dueDate,
      borrowId: borrow._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    // Find active borrow record
    const borrow = await Borrow.findOne({
      book: bookId,
      user: userId,
      status: "borrowed"
    }).populate("book");

    if (!borrow)
      return res.status(404).json({ message: "Borrow record not found" });

    borrow.status = "returned";
    borrow.returnedAt = new Date();
    await borrow.save();

    borrow.book.borrowed = false;
    await borrow.book.save();

    res.status(200).json({
      message: "Book returned successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};