const mongoose = require("mongoose");

/**
 * Expense Schema
 * ----------------------------
 * Represents a cost associated with a specific trip.
 * Each trip can have multiple expenses.
 */
const expenseSchema = new mongoose.Schema(
  {
    // Reference to the trip this expense belongs to
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip", // links to the Trip model
      required: true,
    },

    // Payment units (e.g. liters, km, or quantity)
    Payment: {
      type: Number,
      required: true,
    },

    // The rate (e.g. currency exchange, cost per unit)
    rate: {
      type: Number,
      required: true,
    },

    // The actual amount of money spent for this expense
    // This can be calculated as Payment × rate
    amount: {
      type: Number,
      required: true,
    },

    // Optional description or reason for the expense
    reason: {
      type: String,
    },

    // User who added this expense (audit trail)
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User model
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Expense model so it can be used in services/controllers
module.exports = mongoose.model("Expense", expenseSchema);