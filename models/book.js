import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  available: { type: Boolean, default: true }
});

export default mongoose.model("Book", bookSchema);
