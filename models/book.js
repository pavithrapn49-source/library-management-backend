import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    genre: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true
    },

    price: {
      type: Number,
      default: 0
    },

    coverImage: {
      type: String,
      default: ""
    },

    available: {
      type: Boolean,
      default: true
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    borrowedAt: {
      type: Date,
      default: null
    },

    returnedAt: {
      type: Date,
      default: null
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    reservedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Book ||
mongoose.model("Book", bookSchema);