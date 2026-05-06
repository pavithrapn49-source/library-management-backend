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
    if (!record) return res.status(404).json({ message: "Not found" });

    record.status = "borrowed";
    record.borrowedAt = new Date();

    // ✅ Set due date (7 days)
    const due = new Date();
    due.setDate(due.getDate() + 7);
    record.dueDate = due;

    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Return
export const returnBook = async (req, res) => {
  try {
    const { recordId } = req.body;

    const record = await Borrow.findById(recordId).populate("book");

    if (!record) return res.status(404).json({ message: "Not found" });

    record.status = "returned";
    record.returnedAt = new Date();

    // ✅ Fine calculation
    if (record.dueDate) {
      const today = new Date();

      if (today > record.dueDate) {
        const lateDays = Math.ceil(
          (today - record.dueDate) / (1000 * 60 * 60 * 24)
        );

        record.fine = lateDays * 10; // ₹10/day
      }
    }

    await record.save();

    // restore copies
    record.book.copies += 1;
    await record.book.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getMyReturnedBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user.id,
      status: "returned",
    }).populate("book");

    res.json(records);
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
export const getMyHistory = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user.id,
    }).populate("book");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};