import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  borrowed: { type: Boolean, default: false },
   borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: Date
});

export default mongoose.model("Book", bookSchema);