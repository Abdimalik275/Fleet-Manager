const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

/**
 * TripService
 * ----------------------------
 * Handles all business logic related to trips.
 */

// Create a new trip
exports.createTrip = async (data) => {
  return Trip.create(data);
};

// Get all trips with optional filters
exports.getAllTrips = async (filters = {}) => {
  return Trip.find(filters)
    .populate("truckId", "name plateNumber")
    .populate("driverId", "name")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .lean();
};

// Get a single trip by ID
exports.getTripById = async (tripId) => {
  return Trip.findById(tripId)
    .populate("truckId", "name plateNumber")
    .populate("driverId", "name")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .lean();
};

// Update trip details
exports.updateTrip = async (tripId, data, userId) => {
  return Trip.findByIdAndUpdate(
    tripId,
    { ...data, updatedBy: userId },
    { new: true }
  );
};

// Mark trip as completed
exports.completeTrip = async (tripId) => {
  return Trip.findByIdAndUpdate(
    tripId,
    { status: "completed", endTime: new Date() },
    { new: true }
  );
};

// Delete a trip
exports.deleteTrip = async (tripId) => {
  return Trip.findByIdAndDelete(tripId);
};

// Get trips along with their expenses, totals, and profit
exports.getTripsWithExpenses = async (filters = {}) => {
  const trips = await Trip.find(filters).lean();

  for (let trip of trips) {
    const expenses = await Expense.find({ tripId: trip._id }).lean();

    // Calculate total expenses used
    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Attach expenses + totals
    trip.expenses = expenses;
    trip.totalExpenses = totalExpenses;
    trip.profit = trip.transport - totalExpenses;
  }

  return trips;
};