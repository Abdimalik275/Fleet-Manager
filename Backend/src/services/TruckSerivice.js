const Truck = require("../models/Truck");

class TruckService {
  // CREATE truck (with optional driver)
  async createTruck(data, userId) {
    // Check if plate number already exists
    const existingTruck = await Truck.findOne({ plateNumber: data.plateNumber });
    if (existingTruck) throw new Error("Truck with this plate number already exists");

    // Determine status automatically
    let status = data.driverName && data.PhonNumber ? "in-use" : "available";

    // Create truck
    const truck = await Truck.create({
      plateNumber: data.plateNumber,
      model: data.model,
      capacity: data.capacity,
      status,
      driverName: data.driverName || null,
      PhonNumber: data.PhonNumber || null,
      createdBy: userId,
    });

    return truck;
  }

  // GET all trucks
  async getAllTrucks() {
    return Truck.find();
  }

  // GET truck by ID
  async getTruckById(id) {
    const truck = await Truck.findById(id);
    if (!truck) throw new Error("Truck not found");
    return truck;
  }

  // UPDATE truck
  async updateTruck(id, data, userId) {
    const truck = await Truck.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true }
    );
    if (!truck) throw new Error("Truck not found");
    return truck;
  }

  // DELETE truck
  async deleteTruck(id) {
    const truck = await Truck.findByIdAndDelete(id);
    if (!truck) throw new Error("Truck not found");
    return truck;
  }

}

module.exports = new TruckService();
