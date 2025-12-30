const mongoose = require("mongoose");

/**
 * Trip Schema
 * ----------------------------
 * Represents ONE real-world journey of a truck.
 * A truck can have MANY trips over time.
 * This schema stores trip details and transport money.
 */
const tripSchema = new mongoose.Schema(
  {
    // Reference to the truck assigned for this trip
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck", // links to the Truck model
      required: true,
    },

    // Reference to the driver assigned for this trip
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver", // links to the Driver model
      required: true,
    },

    // Product being transported (restricted to specific fuel types)
    product: {
      type: String,
      enum: ["AGO", "PMS", "JET A-1"], // only these values allowed
      required: true,
    },

    // Route details: origin and destination of the trip
    route: {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
    },

    // Transport money (the total amount allocated/earned for this trip)
    transport: {
      type: Number,
      required: true,
    },

    // Current status of the trip
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"], // only these states allowed
      default: "scheduled", // default when a trip is first created
    },

    // Start time of the trip
    startTime: { type: Date, required: true },

    // End time of the trip (optional, filled when trip is completed)
    endTime: { type: Date },

    // User who created the trip record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User model
      required: true,
    },

    // User who last updated the trip record
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Trip model so it can be used in services/controllers
module.exports = mongoose.model("Trip", tripSchema);