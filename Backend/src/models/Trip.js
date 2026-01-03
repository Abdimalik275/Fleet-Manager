const mongoose = require("mongoose");

/**
 * Trip Schema
 * ----------------------------
 * Represents ONE real-world journey of a truck.
 * Driver is inferred from the Truck.
 */
const tripSchema = new mongoose.Schema(
  {
    // Reference to the truck used in this trip
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    // Product being transported
    product: {
      type: String,
      enum: ["AGO", "PMS", "JET A-1"],
      required: true,
    },

    // Route details
    route: {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
    },

    // Transport money earned for this trip
    transport: {
      type: Number,
      required: true,
    },

    // Trip status
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "scheduled",
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
