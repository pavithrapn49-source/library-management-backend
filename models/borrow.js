import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "borrowed" },
  borrowedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Borrow", borrowSchema);
