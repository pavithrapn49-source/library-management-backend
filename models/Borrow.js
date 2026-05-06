import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },

    status: {
      type: String,
      enum: ["reserved", "borrowed", "returned"],
      default: "reserved",
    },

    reservedAt: Date,
    borrowedAt: Date,
    returnedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);