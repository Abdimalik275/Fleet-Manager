const TripService = require("../services/TripService");

/**
 * CREATE TRIP
 * ---------------------------------
 * Handles POST /api/trips
 */
exports.createTrip = async (req, res) => {
  try {
    const trip = await TripService.createTrip({
      ...req.body,
      createdBy: req.user._id,
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
 * DOWNLOAD TRIP REPORT
 * ---------------------------------
 * Handles GET /api/trips/report/download
 */
exports.downloadTripReport = async (req, res) => {
  try {
    const tripsWithExpenses = await TripService.getTripsWithExpenses(req.query);

    res.status(200).json({
      success: true,
      message: "Trip report generated successfully",
      data: tripsWithExpenses,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * TRUCK MONTHLY REPORT
 * ---------------------------------
 * Handles GET /api/trucks/:id/report/monthly
 */
exports.getTruckMonthlyReport = async (req, res) => {
  try {
    const { id } = req.params; // truckId
    const { start, end } = req.query; // month range

    const report = await TripService.getTruckMonthlyReport(
      id,
      new Date(start),
      new Date(end)
    );

    res.status(200).json({
      success: true,
      message: "Truck monthly report generated successfully",
      data: report,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * TRUCK YEARLY REPORT
 * ---------------------------------
 * Handles GET /api/trucks/:id/report/yearly
 */
exports.getTruckYearlyReport = async (req, res) => {
  try {
    const { id } = req.params; // truckId
    const { year } = req.query; // e.g. 2026

    const report = await TripService.getTruckYearlyReport(id, year);

    res.status(200).json({
      success: true,
      message: "Truck yearly report generated successfully",
      data: report,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};