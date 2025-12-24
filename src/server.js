const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const truckRoutes = require("./routes/truck.routes");
const driverRoutes = require("./routes/driver.routes");

const app = express();

/* =======================
   SECURITY & GLOBAL MIDDLEWARE
======================= */

// Security headers
app.use(helmet());

// Trust proxy (important for cookies behind proxies like Render)
app.set("trust proxy", 1);

// Body parsing
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trucks", truckRoutes);

/* =======================
   HEALTH & ROOT
======================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.get("/", (req, res) => {
  res.json({ message: "🚀 Fleet Management API running" });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
