const TruckService = require("../services/TruckSerivice");

// CREATE truck
const createTruck = async (req, res) => {
  try {
    const truck = await TruckService.createTruck(req.body, req.user.id);
    res.status(201).json({ success: true, message: "Truck created successfully", data: truck });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET all trucks
const getAllTrucks = async (req, res) => {
  try {
    const trucks = await TruckService.getAllTrucks();
    res.json({
      success: true,
      message: trucks.length ? "Trucks retrieved successfully" : "No trucks found",
      data: trucks,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET truck by ID
const getTruckById = async (req, res) => {
  try {
    const truck = await TruckService.getTruckById(req.params.id);
    res.json({ success: true, data: truck });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// UPDATE truck
const updateTruck = async (req, res) => {
  try {
    const truck = await TruckService.updateTruck(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: "Truck updated successfully", data: truck });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE truck
const deleteTruck = async (req, res) => {
  try {
    await TruckService.deleteTruck(req.params.id);
    res.json({ success: true, message: "Truck deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ASSIGN or UPDATE driver
const assignDriver = async (req, res) => {
  try {
    const truck = await TruckService.assignDriver(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: "Driver assigned successfully", data: truck });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTruck,
  getAllTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  assignDriver,
};
