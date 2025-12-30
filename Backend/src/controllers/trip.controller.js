const TripService = require("../services/TripService");

/**
 * CREATE TRIP
 * ---------------------------------
 * Handles POST /api/trips
 * Creates a new trip record with transport money set.
 */
exports.createTrip = async (req, res) => {
  try {
    const trip = await TripService.createTrip({
      ...req.body,
      createdBy: req.user._id, // track who created the trip
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET ALL TRIPS
 * ---------------------------------
 * Handles GET /api/trips
 * Fetches all trips with optional filters (e.g. status, driver).
 */
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await TripService.getAllTrips(req.query);

    res.status(200).json({
      success: true,
      message: "Trips fetched successfully",
      data: trips,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET SINGLE TRIP
 * ---------------------------------
 * Handles GET /api/trips/:id
 * Fetches one trip by its ID.
 */
exports.getTripById = async (req, res) => {
  try {
    const trip = await TripService.getTripById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trip fetched successfully",
      data: trip,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE TRIP
 * ---------------------------------
 * Handles PUT /api/trips/:id
 * Updates trip details and records who updated it.
 */
exports.updateTrip = async (req, res) => {
  try {
    const trip = await TripService.updateTrip(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * COMPLETE TRIP
 * ---------------------------------
 * Handles PATCH /api/trips/:id/complete
 * Marks a trip as completed and sets its end time.
 */
exports.completeTrip = async (req, res) => {
  try {
    const trip = await TripService.completeTrip(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Trip completed successfully",
      data: trip,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE TRIP
 * ---------------------------------
 * Handles DELETE /api/trips/:id
 * Removes a trip from the database.
 */
exports.deleteTrip = async (req, res) => {
  try {
    await TripService.deleteTrip(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DOWNLOAD TRIP REPORT (JSON only)
 * ---------------------------------
 * Handles GET /api/trips/report/download
 * Fetches trips with their expenses, total expenses used, and profit.
 * TripService.getTripsWithExpenses calculates totals and profit automatically.
 */
exports.downloadTripReport = async (req, res) => {
  try {
    const tripsWithExpenses = await TripService.getTripsWithExpenses(req.query);

    res.status(200).json({
      success: true,
      message: "Trip report generated successfully",
      data: tripsWithExpenses, // includes expenses, totalExpenses, profit
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};