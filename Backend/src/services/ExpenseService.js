const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

/**
 * ExpenseService
 * ----------------------------
 * Handles all business logic for expenses.
 * Adds expenses and ensures they deduct from trip transport money.
 */

// Add a new expense to a specific trip
exports.addExpense = async (tripId, data, addedBy) => {
  // Calculate expense cost = Payment × rate
  const totalCost = data.Payment * data.rate;

  // Create expense record with calculated amount
  const expense = await Expense.create({
    ...data,
    tripId,
    addedBy,
    amount: totalCost, // ensure amount is always Payment × rate
  });

  // Find the trip
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");

  // Deduct expense from transport money
  trip.transport = trip.transport - totalCost;

  await trip.save();

  return expense;
};

// Get all expenses for a specific trip
exports.getExpensesByTrip = async (tripId) => {
  return Expense.find({ tripId }).lean();
};