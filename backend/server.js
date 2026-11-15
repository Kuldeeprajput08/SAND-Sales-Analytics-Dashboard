import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/sales", salesRoutes);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SAND - Sales Analytics Dashboard API",
  });
});

// MongoDB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`SAND server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
