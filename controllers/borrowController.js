import Borrow from "../models/Borrow.js";
import Book from "../models/book.js";

// ✅ Reserve
export const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.copies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    const record = await Borrow.create({
      user: req.user.id,
      book: bookId,
      status: "reserved",
      reservedAt: new Date(),
    });

    book.copies -= 1;
    await book.save();

    res.json({ message: "Reserved successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Reserved
export const getMyReservedBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user.id,
      status: "reserved",
    }).populate("book");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Borrow
export const borrowBook = async (req, res) => {
  try {
    const { recordId } = req.body;

    const record = await Borrow.findById(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.status = "borrowed";
    record.borrowedAt = new Date();

    await record.save();

    res.json({ message: "Borrowed successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Return
export const returnBook = async (req, res) => {
  try {
    const { recordId } = req.body;

    const record = await Borrow.findById(recordId).populate("book");
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.status = "returned";
    record.returnedAt = new Date();

    await record.save();

    record.book.copies += 1;
    await record.book.save();

    res.json({ message: "Returned successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Borrowed books
export const getMyBorrowedBooks = async (req, res) => {
  const records = await Borrow.find({
    user: req.user.id,
    status: "borrowed",
  }).populate("book");

  res.json(records);
};

// ✅ Full history
export const getHistory = async (req, res) => {
  const records = await Borrow.find({
    user: req.user.id,
  }).populate("book");

  res.json(records);
};