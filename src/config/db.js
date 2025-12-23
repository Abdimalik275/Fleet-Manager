const mongoose = require("mongoose");
require("dotenv").config(); 
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(uri, {
   
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};


module.exports = connectDB;