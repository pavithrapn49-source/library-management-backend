import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },

  author: { type: String, required: true },

  isbn: { type: String, required: true, unique: true },

  genre: { type: String },

  publicationYear: { type: Number },

  borrowed: { type: Boolean, default: false },

  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  dueDate: { type: Date }

}, { timestamps: true });

export default mongoose.model("Book", bookSchema);