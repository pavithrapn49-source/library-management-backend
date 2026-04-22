import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  price: Number,

  available: {
    type: Boolean,
    default: true,
  },

  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  borrowedAt: Date,
  returnedAt: Date,

  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  reservedAt: Date,
});

const Book = mongoose.model("Book", bookSchema);

export default Book;