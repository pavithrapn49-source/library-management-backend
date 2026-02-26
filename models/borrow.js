import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed"
    },
    dueDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);