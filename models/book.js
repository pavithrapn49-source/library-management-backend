import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    coverImage: {
      type: String,
      default: "",
    },

    /* ================= RESERVATION QUEUE ================= */

    reservationQueue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ================= COPIES ================= */

    availableCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ================= VIRTUAL AVAILABLE ================= */

bookSchema.virtual("available").get(function () {
  return this.availableCopies > 0;
});

export default mongoose.models.Book ||
  mongoose.model("Book", bookSchema);