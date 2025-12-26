const Driver = require('../models/Driver');
const Truck = require('../models/Truck');

 class AssignmentService{
     async assignDriverTruck({ driverId, truckId, performeBy}){
         const driver = await Driver.findById(driverId);
         if(!driver) throw new Error(' Driver is not found');

          const truck  = await Truck.findById(truckId);
           if(!truck) throw new Error('Truck is not Found');

            //Bussines Rule 
            if(driver.status !== 'available'){
                throw new Error ("Driver is not Available");
            }
            if(Truck.status !== 'available'){
                throw new Error ("truck is not Available");
            }
            if(driver.assignedTrucks.includes(truckId)){
                throw new Error ("Driver already Assigned to this truck");
            }

    // Update driver record
    driver.assignedTrucks.push(truckId);   // link truck to driver
    driver.status = 'assigned';           // mark driver as assigned
    driver.updatedBy = performedBy;       // audit trail: who performed action

    // Update truck record
    truck.assignedDrivers.push(driverId); // link driver to truck
    truck.status = 'in-use';              // mark truck as in-use
    truck.updatedBy = performedBy;        // audit trail: who performed action

    //  Save both documents
    await driver.save();
    await truck.save();

    //  Return updated entities
    return { driver, truck };
  }
}

module.exports = new AssignmentService();
