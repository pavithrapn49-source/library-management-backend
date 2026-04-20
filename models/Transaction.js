import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  borrowDate: { type: Date, default: Date.now },
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" }
});

export default mongoose.model("Transaction", transactionSchema);
