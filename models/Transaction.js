import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= BOOK ================= */
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    /* ================= DATES ================= */
    borrowDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: () =>
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
    },

    returnDate: {
      type: Date,
      default: null,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },

    /* ================= FINE ================= */
    fine: {
      type: Number,
      default: 0,
    },

    finePaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);