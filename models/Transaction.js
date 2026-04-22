import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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

  borrowDate: {
    type: Date,
    default: Date.now,
  },

  dueDate: {
    type: Date,
    default: () =>
      new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
  },

  returnDate: {
    type: Date,
    default: null,
  },

  status: {
    type: String,
    enum: [
      "borrowed",
      "returned",
    ],
    default: "borrowed",
  },

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

transactionSchema.index({ user: 1 });
transactionSchema.index({ book: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model(
  "Transaction",
  transactionSchema
);