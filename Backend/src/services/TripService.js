const Trip = require("../models/Trip");
const Truck = require("../models/Truck");
const Expense = require("../models/Expense");

/**
 * CREATE TRIP
 */
exports.createTrip = async (data) => {
  const { truckId } = data;

  const truck = await Truck.findById(truckId);
  if (!truck) throw new Error("Truck not found");

  if (truck.status !== "available") {
    throw new Error(`Cannot create trip. Truck is currently ${truck.status}`);
  }

  const trip = await Trip.create({
    ...data,
    status: "in-progress",
    // ➡️ createdBy is passed in from controller as req.user.id
  });

  truck.status = "in-use";
  await truck.save();

  return trip;
};

/**
 * GET ALL TRIPS
 */
exports.getAllTrips = async (filters = {}) => {
  return Trip.find(filters)
    .populate("truckId", "plateNumber model status")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .lean();
};

/**
 * GET TRIP BY ID
 */
exports.getTripById = async (tripId) => {
  return Trip.findById(tripId)
    .populate("truckId", "plateNumber model status")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .lean();
};

/**
 * UPDATE TRIP
 */
exports.updateTrip = async (tripId, data, userId) => {
  return Trip.findByIdAndUpdate(
    tripId,
    { ...data, updatedBy: userId }, // ➡️ userId comes from req.user.id
    { new: true }
  );
};

/**
 * COMPLETE TRIP
 */
exports.completeTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");

  trip.status = "completed";
  trip.endTime = new Date();
  trip.updatedBy = userId; // ➡️ userId comes from req.user.id
  await trip.save();

  await Truck.findByIdAndUpdate(trip.truckId, { status: "available" });

  return trip;
};

/**
 * DELETE TRIP
 */
exports.deleteTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);

  if (trip && trip.status !== "completed") {
    await Truck.findByIdAndUpdate(trip.truckId, { status: "available" });
  }

  return Trip.findByIdAndDelete(tripId);
};

/**
 * TRIP REPORT (per-trip expenses + profit)
 */
exports.getTripsWithExpenses = async (filters = {}) => {
  const trips = await Trip.find(filters).lean();

  for (let trip of trips) {
    const expenses = await Expense.find({ tripId: trip._id }).lean();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    trip.expenses = expenses;
    trip.totalExpenses = totalExpenses;
    trip.profit = trip.transport - totalExpenses;
  }

  return trips;
};

/**
 * TRUCK MONTHLY REPORT
 */
exports.getTruckMonthlyReport = async (truckId, monthStart, monthEnd) => {
  const truck = await Truck.findById(truckId).lean();
  if (!truck) throw new Error("Truck not found");

  const trips = await Trip.find({
    truckId,
    startTime: { $gte: monthStart, $lte: monthEnd },
  }).lean();

  let totalExpenses = 0;
  let totalProfit = 0;

  for (let trip of trips) {
    const expenses = await Expense.find({ tripId: trip._id }).lean();
    const tripExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = trip.transport - tripExpenses;

    trip.expenses = expenses;
    trip.totalExpenses = tripExpenses;
    trip.profit = profit;

    totalExpenses += tripExpenses;
    totalProfit += profit;
  }

  const summary = {
    period: `${monthStart.toISOString().slice(0, 7)} to ${monthEnd.toISOString().slice(0, 7)}`,
    totalTrips: trips.length,
    totalExpenses,
    totalProfit,
  };

  return { truck, trips, summary };
};

/**
 * TRUCK YEARLY REPORT
 */
exports.getTruckYearlyReport = async (truckId, year) => {
  const truck = await Truck.findById(truckId).lean();
  if (!truck) throw new Error("Truck not found");

  const yearStart = new Date(`${year}-01-01T00:00:00Z`);
  const yearEnd = new Date(`${year}-12-31T23:59:59Z`);

  const trips = await Trip.find({
    truckId,
    startTime: { $gte: yearStart, $lte: yearEnd },
  }).lean();

  let totalExpenses = 0;
  let totalProfit = 0;

  for (let trip of trips) {
    const expenses = await Expense.find({ tripId: trip._id }).lean();
    const tripExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = trip.transport - tripExpenses;

    trip.expenses = expenses;
    trip.totalExpenses = tripExpenses;
    trip.profit = profit;

    totalExpenses += tripExpenses;
    totalProfit += profit;
  }

  const summary = {
    year,
    totalTrips: trips.length,
    totalExpenses,
    totalProfit,
  };

  return { truck, trips, summary };
};