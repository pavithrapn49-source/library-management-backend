import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

// ================= BORROW BOOK =================
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).json({ message: "Book not found" });

    if (book.borrowed === true)
      return res.status(400).json({ message: "Book already borrowed" });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      book: book._id,
      user: req.user.id,
      dueDate,
    });

    // ✅ UPDATE BOOK STATUS
    book.borrowed = true;
    book.availabilityStatus = false;
    book.borrowedBy = req.user.id;
    book.dueDate = dueDate;

    await book.save();

    res.json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RETURN BOOK =================
export const returnBook = async (req, res) => {
  try {

    const borrow = await Borrow.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "borrowed"
    }).populate("book");

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    if (borrow.status === "returned") {
      return res.status(400).json({
        message: "Book already returned"
      });
    }

    const book = borrow.book;

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // ✅ Reset book
    book.borrowed = false;
    book.availabilityStatus = true;
    book.borrowedBy = null;
    book.dueDate = null;
    book.reservedBy = null;

    await book.save();

    // ✅ Update borrow
    borrow.status = "returned";
    await borrow.save();

    res.json({
      message: "Book returned successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error returning book"
    });
  }
};
// ================= MY BORROWS =================
export const getMyBorrows = async (req, res) => {
  try {
    // ✅ SHOW ONLY ACTIVE BORROWS
    const borrows = await Borrow.find({
      user: req.user.id,
      status: "borrowed",
    }).populate("book");

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
