import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reviews", reviewRoutes);





// Default route
app.get("/", (req, res) => {
  res.send("Library Management System API is running...");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
