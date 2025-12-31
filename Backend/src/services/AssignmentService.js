const Driver = require('../models/Driver');
const Truck = require('../models/Truck');

class AssignmentService {
  async assignDriverTruck({ driverId, truckId, performedBy }) {
    // Find driver
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver is not found');

    // Find truck
    const truck = await Truck.findById(truckId);
    if (!truck) throw new Error('Truck is not found');

    // Business rules
    if (driver.status !== 'available') {
      throw new Error("Driver is not available");
    }
    if (truck.status !== 'available') {
      throw new Error("Truck is not available");
    }
    if (truck.assignedDriver) {
      throw new Error("Truck already has an assigned driver");
    }
    if (driver.assignedTrucks.includes(truckId)) {
      throw new Error("Driver already assigned to this truck");
    }

    // Update driver record
    driver.assignedTrucks.push(truckId);   // link truck to driver
    driver.status = 'assigned';            // mark driver as assigned
    driver.updatedBy = performedBy;        // audit trail

    // Update truck record
    truck.assignedDriver = driverId;       // single driver assignment
    truck.status = 'in-use';               // mark truck as in-use
    truck.updatedBy = performedBy;         // audit trail

    // Save both documents
    await driver.save();
    await truck.save();

    // Return updated entities
    return { driver, truck };
  }
}

module.exports = new AssignmentService();