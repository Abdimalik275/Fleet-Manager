const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

/**
 * Add Expense
 */
exports.addExpense = async (tripId, expenseData, userId) => {
  // calculate amount if not provided
  const amount = expenseData.amount || expenseData.Payment * expenseData.rate;

  const expense = new Expense({
    tripId,
    Payment: expenseData.Payment,
    rate: expenseData.rate,
    amount,
    reason: expenseData.reason,
    addedBy: userId,
  });

  await expense.save();
  return expense;
};

/**
 * Get Expenses by Trip
 */
exports.getExpensesByTrip = async (tripId) => {
  return Expense.find({ tripId })
    .populate("addedBy", "name email")
    .lean();
};

/**
 * Get Expenses by Truck
 * ---------------------------------
 * Aggregates all expenses across trips for a given truck.
 */
exports.getExpensesByTruck = async (truckId) => {
  // Step 1: Find all trips for this truck
  const trips = await Trip.find({ truckId }).select("_id transport route startTime endTime status").lean();
  const tripIds = trips.map(t => t._id);

  // Step 2: Find all expenses linked to those trips
  const expenses = await Expense.find({ tripId: { $in: tripIds } })
    .populate("tripId", "route startTime endTime status transport")
    .populate("addedBy", "name email")
    .lean();

  // Step 3: Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransport = trips.reduce((sum, trip) => sum + trip.transport, 0);
  const profit = totalTransport - totalExpenses;

  return {
    truckId,
    trips: trips.length,
    totalTransport,
    totalExpenses,
    profit,
    expenses,
  };
};