import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["member", "librarian", "admin"],
    default: "member"
  }
},
{
  timestamps: true
}
);

// HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.password) return next(); // 🔥 Prevent crash

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// CHECK PASSWORD
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);