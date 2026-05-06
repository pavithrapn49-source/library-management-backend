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

    dueDate: Date,      
    fine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Borrow || mongoose.model("Borrow", borrowSchema);