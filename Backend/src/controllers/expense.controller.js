const ExpenseService = require("../services/ExpenseService");

/**
 * ADD EXPENSE
 * ---------------------------------
 * Handles POST /api/trips/:tripId/expenses
 * Creates a new expense linked to a specific trip.
 * Business logic: ExpenseService.addExpense will calculate Payment × rate,
 * save the expense, and deduct the cost from the trip's transport money.
 */
exports.addExpense = async (req, res) => {
  try {
    const expense = await ExpenseService.addExpense(
      req.params.tripId,   // trip ID from URL
      req.body,            // expense details (Payment, rate, reason)
      req.user.id          // user who added the expense
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET EXPENSES BY TRIP
 * ---------------------------------
 * Handles GET /api/trips/:tripId/expenses
 * Fetches all expenses linked to a specific trip.
 */
exports.getExpensesByTrip = async (req, res) => {
  try {
    const expenses = await ExpenseService.getExpensesByTrip(req.params.tripId);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET EXPENSES BY TRUCK
 * ---------------------------------
 * Handles GET /api/trips/:id/expenses/report
 * Aggregates all expenses across trips for a given truck.
 */
exports.getExpensesByTruck = async (req, res) => {
  try {
    const report = await ExpenseService.getExpensesByTruck(req.params.id);

    res.status(200).json({
      success: true,
      message: "Truck expenses report generated successfully",
      data: report,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Expenses 
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await ExpenseService.deleteExpense(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deletedExpense,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
