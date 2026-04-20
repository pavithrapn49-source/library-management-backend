import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
