import Book from "../models/book.js";
import Borrow from "../models/borrow.js";
import User from "../models/user.js";

export const adminStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const borrowedBooks = await Borrow.countDocuments({ returned: false });
    const activeUsers = await User.countDocuments();

    res.json({
      totalBooks,
      borrowedBooks,
      activeUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

   




