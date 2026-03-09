import Book from "../models/book.js";

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