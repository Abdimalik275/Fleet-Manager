const TripService = require("../services/TripService");

/**
 * CREATE TRIP
 * POST /api/trips
 */
exports.createTrip = async (req, res) => {
  try {
    const trip = await TripService.createTrip(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL TRIPS
 * GET /api/trips
 */
exports.getTrips = async (req, res) => {
  try {
    const trips = await TripService.getTrips(req.query);

    res.status(200).json({
      success: true,
      message: "Trips fetched successfully",
      data: trips,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET SINGLE TRIP BY ID
 * GET /api/trips/:id
 */
exports.getTripById = async (req, res) => {
  try {
    const trip = await TripService.getTripById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trip fetched successfully",
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE TRIP
 * PUT /api/trips/:id
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * COMPLETE TRIP
 * POST /api/trips/:id/complete
 */
exports.completeTrip = async (req, res) => {
  try {
    const trip = await TripService.completeTrip(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trip completed successfully",
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE TRIP
 * DELETE /api/trips/:id
 */
exports.deleteTrip = async (req, res) => {
  try {
    await TripService.deleteTrip(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
