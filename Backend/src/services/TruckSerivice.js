const Truck = require("../models/Truck");

class TruckService {
  // Create a truck (with optional driver)
  async createTruck(data, userId) {
    // 1️⃣ Check if plate number already exists
    const existingTruck = await Truck.findOne({ plateNumber: data.plateNumber });
    if (existingTruck) throw new Error("Truck with this plate number already exists");

    // 2️⃣ Decide truck status
    let status = "available";
    if (data.driver && data.driver.name) {
      status = "in-use"; // truck is in-use if driver info is provided
    }

    // 3️⃣ Create the truck with driver info if provided
    const truck = await Truck.create({
      plateNumber: data.plateNumber,
      model: data.model,
      capacity: data.capacity,
      status,
      driver: data.driver || null,
      createdBy: userId,
    });

    return truck;
  }

  // Get all trucks
  async getAllTrucks() {
    return Truck.find();
  }

  // Get truck by ID
  async getTruckById(id) {
    return Truck.findById(id);
  }

  // Update truck
  async updateTruck(id, data, userId) {
    const truck = await Truck.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true }
    );

    if (!truck) throw new Error("Truck not found");
    return truck;
  }

  // Delete truck
  async deleteTruck(id) {
    const truck = await Truck.findByIdAndDelete(id);
    if (!truck) throw new Error("Truck not found");
    return truck;
  }

  // Assign or change driver
  async assignDriver(id, driverData, userId) {
    const truck = await Truck.findById(id);
    if (!truck) throw new Error("Truck not found");

    truck.driver = driverData;
    truck.status = driverData.name ? "in-use" : "available"; // update status based on driver
    truck.updatedBy = userId;

    await truck.save();
    return truck;
  }
}

module.exports = new TruckService();
