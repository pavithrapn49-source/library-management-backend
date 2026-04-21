import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS setup: allow frontend (local + deployed)
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
  credentials: true,
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reviews", reviewRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Port handling for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
