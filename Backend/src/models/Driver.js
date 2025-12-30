const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },


  
    // Driver availability
    status: {
      type: String,
      enum: ['available', 'assigned', 'inactive'],
      default: 'available',
    },

    // Many-to-many relationship
    assignedTrucks: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    ],

    // Audit fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
