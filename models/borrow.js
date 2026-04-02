import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    // ✅ Track return status
    returned: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW: actual return date
    returnDate: {
      type: Date,
      default: null,
    },

    // ✅ OPTIONAL: fine amount
    fine: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);