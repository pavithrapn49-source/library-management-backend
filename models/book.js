import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },

    // ✅ FIXED FIELDS
    borrowed: { type: Boolean, default: false },
    availabilityStatus: { type: Boolean, default: true },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);