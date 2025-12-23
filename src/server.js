// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// ==============================
// CORS Configuration
// ==============================
app.use(cors({
  origin: process.env.FRONTEND_URL, // http://localhost:3000 or your deployed frontend
  credentials: true,                // allow cookies if needed
}));

// ==============================
// Body Parser
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Routes
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ==============================
// MongoDB Connection
// ==============================
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Stop the server if DB fails
  }
};

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
