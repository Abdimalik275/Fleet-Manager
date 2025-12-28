const Truck = require('../models/Truck');
const AssignmentService = require('../services/AssignmentService');

// CREATE TRUCK
const createTruck = async (req, res) => {
  try {
    const truck = await Truck.create({
      ...req.body,
      createdBy: req.user.id, // audit trail
    });
    res.status(201).json({ 
      success: true, 
      message: "Truck created successfully",
      data: truck
    });
  } catch (err) {
    // Handle duplicate plateNumber error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.plateNumber) {
      return res.status(400).json({
        success: false,
        message: "Truck with this plate number already exists"
      });
    }

    res.status(400).json({ 
      success: false, 
      message: `Failed to create truck: ${err.message}` 
    });
  }
};

// GET ALL TRUCKS
const getAllTrucks = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const trucks = await Truck.find(filter).populate('assignedDrivers');
    res.json({ 
      success: true, 
      message: trucks.length ? "Trucks retrieved successfully" : "No trucks found",
      data: trucks 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to get trucks: ${err.message}` 
    });
  }
};

// GET TRUCK BY ID
const getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate('assignedDrivers');
    if (!truck) 
      return res.status(404).json({ success: false, message: 'Truck not found' });
    res.json({ 
      success: true, 
      message: "Truck retrieved successfully",
      data: truck 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to get truck: ${err.message}` 
    });
  }
};

// UPDATE TRUCK
const updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    );
    if (!truck) 
      return res.status(404).json({ success: false, message: 'Truck not found' });
    res.json({ 
      success: true, 
      message: "Truck updated successfully",
      data: truck 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to update truck: ${err.message}` 
    });
  }
};

// DELETE TRUCK
const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) 
      return res.status(404).json({ success: false, message: 'Truck not found' });
    res.json({ 
      success: true, 
      message: "Truck deleted successfully" 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to delete truck: ${err.message}` 
    });
  }
};

// ASSIGN DRIVER TO TRUCK
const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const truckId = req.params.id;
    const performedBy = req.user.id;

    const result = await AssignmentService.assignDriverTruck({ driverId, truckId, performedBy });

    res.status(200).json({ 
      success: true, 
      message: "Driver assigned to truck successfully",
      data: result 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to assign driver: ${err.message}` 
    });
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
