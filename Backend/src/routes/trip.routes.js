const express = require("express");
const TripController = require("../controllers/trip.controller");
const ExpenseController = require("../controllers/expense.controller");
const authenticate = require("../middlewares/auth.middlewares");

const router = express.Router();

// --------------------
// Trip routes
// --------------------
router.post("/", authenticate, TripController.createTrip);                 // Create trip
router.get("/", authenticate, TripController.getAllTrips);                 // Get all trips
router.get("/:id", authenticate, TripController.getTripById);              // Get single trip
router.put("/:id", authenticate, TripController.updateTrip);               // Update trip
router.patch("/:id/complete", authenticate, TripController.completeTrip);  // Complete trip
router.delete("/:id", authenticate, TripController.deleteTrip);            // Delete trip
router.get("/report/download", authenticate, TripController.downloadTripReport); // Download trip report

// --------------------
// Truck report routes
// --------------------
router.get("/:id/report/monthly", authenticate, TripController.getTruckMonthlyReport); // Truck monthly report
router.get("/:id/report/yearly", authenticate, TripController.getTruckYearlyReport);   // Truck yearly report

// --------------------
// Expense routes
// --------------------
router.post("/:tripId/expenses", authenticate, ExpenseController.addExpense);        // Add expense to trip
router.get("/:tripId/expenses", authenticate, ExpenseController.getExpensesByTrip);  // Get expenses for trip

// --------------------
// Truck expenses report route
// --------------------
router.get("/:id/expenses/report", authenticate, ExpenseController.getExpensesByTruck); // Get all expenses for truck

module.exports = router;