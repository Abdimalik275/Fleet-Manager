const mongoose = require("mongoose");


const tripSchema = new mongoose.Schema({
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Driver",
        require:true,
    },
    truckId:{
        type:mongoose.Schema.Types.ObjectId,
         ref: "Truck",
         require: true,
    },
    cargoType:{
        type:String,
        require:true,
    },

route:{
    origin:{
    type:String,
    require:true,
},
destination:{
    type:String,
    require:true,
}
},

startTime: { type: Date, required: true },
endTime: { type: Date },

status: {
  type: String,
  enum: ["scheduled", "in-progress", "completed"],
  default: "scheduled",
},

rateType: {
    type: String,
    enum: ["perTrip", "perKm", "perTon"],
    required: true,
  },
  rateValue: { type: Number, required: true },

  expenses: {
    fuel: { type: Number, default: 0 },
    tolls: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);