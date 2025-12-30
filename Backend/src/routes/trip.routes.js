const express = require("express");
const TripController = require("../controllers/trip.controller");
const ExpenseController = require("../controllers/expense.controller");

const router = express.Router();

// --------------------
// Trip routes
// --------------------
router.post("/", TripController.createTrip);              // Create trip
router.get("/", TripController.getAllTrips);              // Get all trips
router.get("/:id", TripController.getTripById);           // Get single trip
router.put("/:id", TripController.updateTrip);            // Update trip
router.patch("/:id/complete", TripController.completeTrip); // Complete trip
router.delete("/:id", TripController.deleteTrip);         // Delete trip
router.get("/report/download", TripController.downloadTripReport); // Trip report

// --------------------
// Expense routes
// --------------------
router.post("/:tripId/expenses", ExpenseController.addExpense);   // Add expense to trip
router.get("/:tripId/expenses", ExpenseController.getExpensesByTrip); // Get expenses for trip

module.exports = router;