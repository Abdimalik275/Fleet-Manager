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
      req.user._id         // user who added the expense
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,       // return the created expense
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
 * Returns a list of expenses with their calculated amounts.
 */
exports.getExpensesByTrip = async (req, res) => {
  try {
    const expenses = await ExpenseService.getExpensesByTrip(req.params.tripId);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,      // return all expenses for this trip
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};