const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    // ======================
    // Truck basic info
    // ======================
    plateNumber: {
      type: String,
      required: true,
      unique: true,
    },

    model: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    // ======================
    // Truck status
    // ======================
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },

    // ======================
    // Current driver (ONLY ONE)
    // ======================
    driver: {
      name: String,
      phone: String,
  
    },

    // ======================
    // Audit fields
    // ======================
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Truck", truckSchema);
