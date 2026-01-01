import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminExists = await User.findOne({ email: "admin@test.com" });
  if (adminExists) {
    console.log("⚠️ Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "1234",
    isAdmin: true
  });

  console.log("✅ Admin user created successfully");
  process.exit();
};

run();
