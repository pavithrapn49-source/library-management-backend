import Transaction from "../models/Transaction.js";
import Book from "../models/book.js";

// Borrow book
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book not available" });
    }

    book.available = false;
    await book.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      book: book._id,
      status: "borrowed",
      borrowDate: Date.now()
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Return book
export const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.status === "returned") {
      return res.status(400).json({ message: "Invalid transaction" });
    }

    transaction.status = "returned";
    transaction.returnDate = Date.now();
    await transaction.save();

    const book = await Book.findById(transaction.book);
    book.available = true;
    await book.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
