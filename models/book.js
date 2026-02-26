import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  borrowed: { type: Boolean, default: false },
});

export default mongoose.model("Book", bookSchema);