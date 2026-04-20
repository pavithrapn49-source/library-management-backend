import Book from "../models/Book.js";


// Get all books
export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

// Add book
export const addBook = async (req, res) => {
  const { title, author, genre } = req.body;
  const book = await Book.create({ title, author, genre, available: true });
  res.json(book);
};

// Reserve book
export const reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || book.available) {
      return res.status(400).json({ message: "Book is already available" });
    }
    // In a real system, you'd track reservations separately
    res.json({ message: `Book "${book.title}" reserved successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
