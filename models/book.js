import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },

    author: { 
      type: String, 
      required: true 
    },

    // ✅ Only keep reservation here
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // OPTIONAL: image support
    image: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);