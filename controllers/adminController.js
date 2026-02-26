import User from "../models/user.js";
import Book from "../models/Book.js";
import Borrow from "../models/borrow.js";

export const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  const totalBorrows = await Borrow.countDocuments();

  res.json({
    totalUsers,
    totalBooks,
    totalBorrows,
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

