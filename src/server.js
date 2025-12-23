const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Security headers
app.use(helmet());

// Trust proxy (important for secure cookies behind Render/other proxies)
app.set("trust proxy", 1);

// Connect database
connectDB();

// Body parsing
app.use(express.json());
app.use(cookieParser());

// CORS: allow only your frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g., https://fleet-frontend.onrender.com
    credentials: true,                // allow cookies/authorization headers if needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Fleet Management API running" });
});

// Centralized error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 1500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});