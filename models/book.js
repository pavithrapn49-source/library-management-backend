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
      required: true,
      trim: true,
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
      required: true,
      min: 0,
    },

    coverImage: {
      type: String,
      default: "",
    },

    totalCopies: {
      type: Number,
      default: 1,
      min: 1,
    },

    availableCopies: {
      type: Number,
      default: 1,
      min: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    borrowedAt: Date,

    returnedAt: Date,

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reservedAt: Date,
  },
  {
    timestamps: true,
  }
);

/* AUTO UPDATE AVAILABILITY */
bookSchema.pre("save", function (next) {
  this.available = this.availableCopies > 0;
  next();
});

export default mongoose.models.Book ||
mongoose.model("Book", bookSchema);