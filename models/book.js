import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema({
    user: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const bookSchema =
  new mongoose.Schema(
    {
      /* ================= BASIC ================= */

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

      /* ================= STATUS ================= */

      status: {
        type: String,
        enum: [
          "available",
          "reserved",
          "unavailable",
        ],
        default: "available",
      },

      /* ================= COPIES ================= */

      availableCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
      },

      totalCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },

      /* ================= RESERVATION ================= */

      reservationQueue: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      reservedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      /* ================= REVIEWS ================= */

      reviews: [reviewSchema],

      averageRating: {
        type: Number,
        default: 0,
      },

      numReviews: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,

      toJSON: {
        virtuals: true,
      },

      toObject: {
        virtuals: true,
      },
    }
  );

/* ================= VIRTUAL ================= */

bookSchema.virtual("available").get(
  function () {
    return this.availableCopies > 0;
  }
);

/* ================= AUTO STATUS ================= */

bookSchema.pre("save", function (next) {

  if (this.availableCopies <= 0) {

    this.status = "unavailable";

  } else if (
    this.reservationQueue.length > 0
  ) {

    this.status = "reserved";

  } else {

    this.status = "available";
  }

  next();
});

export default
  mongoose.models.Book ||
  mongoose.model(
    "Book",
    bookSchema
  );