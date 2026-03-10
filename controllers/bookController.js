import Book from "../models/book.js";
import User from "../models/user.js";

// ADD BOOK
export const addBook = async (req, res) => {
  try {

    const book = new Book(req.body);

    await book.save();

    res.status(201).json(book);

  } catch (error) {

    res.status(500).json({ message: "Failed to add book" });

  }
};


// GET BOOKS
export const getBooks = async (req, res) => {

  try {

    const books = await Book.find();

    res.json(books);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch books" });

  }

};


// UPDATE BOOK
export const updateBook = async (req, res) => {

  try {

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBook);

  } catch (error) {

    res.status(500).json({ message: "Update failed" });

  }

};


// DELETE BOOK
export const deleteBook = async (req, res) => {

  try {

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Delete failed" });

  }

};

// RESERVE BOOK-----
export const reserveBook = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (!book.availabilityStatus) {
      return res.status(400).json({
        message: "Book already borrowed"
      });
    }

    book.availabilityStatus = false;

    await book.save();

    res.json({
      message: "Book reserved successfully",
      book
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
// RETURN BOOK
export const returnBook = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    book.availabilityStatus = true;

    await book.save();

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