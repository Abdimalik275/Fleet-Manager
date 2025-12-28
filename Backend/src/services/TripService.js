const Trip = require("../models/Trip");
const Driver = require("../models/Driver");
const Truck =  require("../models/Truck");


// CREATE TRIP

exports.createTrip = async (data, userId) => {
 const { driverId, truckId } = data;

 // Check driver availability
 const driver = await Driver.findById(driverId);
 if (!driver) {
   throw new Error("Driver not found");
 }
 if (driver.status !== "available") {
   throw new Error("Driver is not available");
 }

 // Check truck availability
 const truck = await Truck.findById(truckId);
 if (!truck) {
   throw new Error("Truck not found");
 }
 if (truck.status !== "available") {
   throw new Error("Truck is not available");
 }

 // Create trip
 const trip = await Trip.create({
   ...data,
   createdBy: userId,
 });

 // Update statuses
 driver.status = "assigned";
 truck.status = "assigned";
 await driver.save();
 await truck.save();

 return trip;
};


// UPDATE TRIP

exports.updateTrip = async (tripId, data, userId) => {
 const trip = await Trip.findById(tripId);
 if (!trip) {
   throw new Error("Trip not found");
 }

 Object.assign(trip, data);
 trip.updatedBy = userId;
 await trip.save();

 return trip;
};


//COMPLETE TRIP
exports.completeTrip = async (tripId) => {
 const trip = await Trip.findById(tripId);
 if (!trip) {
   throw new Error("Trip not found");
 }

 if (trip.status === "completed") {
   throw new Error("Trip already completed");
 }

 trip.status = "completed";
 trip.endTime = new Date();
 await trip.save();

 // Release driver & truck
 await Driver.findByIdAndUpdate(trip.driverId, {
   status: "available",
 });

 await Truck.findByIdAndUpdate(trip.truckId, {
   status: "available", 
 });

 return trip;
};


// GET TRIPS

exports.getTrips = async (filter = {}) => {
 return Trip.find(filter)
   .populate("driverId", "name phone")
   .populate("truckId", "plateNumber model")
   .sort({ createdAt: -1 });
};