const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },

    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },

    // Single driver assignment
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Truck', truckSchema);