// services/expense.service.js

const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

/**
 * ======================================================
 * ADD EXPENSE
 * ======================================================
 */
exports.addExpense = async (tripId, expenseData, userId) => {
  const amount =
    expenseData.amount || expenseData.Payment * expenseData.rate;

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
 * ======================================================
 * GET EXPENSES BY TRIP
 * ======================================================
 */
exports.getExpensesByTrip = async (tripId) => {
  return Expense.find({ tripId })
    .populate("addedBy", "name email")
    .lean();
};

/**
 * ======================================================
 * DELETE EXPENSE
 * ======================================================
 */
exports.deleteExpense = async (expenseId) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  await expense.deleteOne();
  return expense;
};

/**
 * ======================================================
 * GET EXPENSES BY TRUCK
 * ======================================================
 * Aggregates all expenses across trips for a given truck
 */
exports.getExpensesByTruck = async (truckId) => {
  // 1. Find all trips for this truck
  const trips = await Trip.find({ truckId })
    .select("_id transport route startTime endTime status")
    .lean();

  const tripIds = trips.map((t) => t._id);

  // 2. Find all expenses for those trips
  const expenses = await Expense.find({ tripId: { $in: tripIds } })
    .populate("tripId", "route startTime endTime status transport")
    .populate("addedBy", "name email")
    .lean();

  // 3. Calculate totals
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const totalTransport = trips.reduce(
    (sum, trip) => sum + trip.transport,
    0
  );

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
