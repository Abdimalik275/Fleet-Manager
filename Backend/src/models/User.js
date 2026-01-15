const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // User email (used for login & password reset)
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true, 
      index: true 
    },

    // Encrypted (hashed) password
    password: { 
      type: String, 
      required: true 
    },

    // Role-based access control
    role: { 
      type: String, 
      enum: ["super_admin", "admin", "operator"], 
      default: "operator", 
      index: true 
    },

    // Used to deactivate accounts without deleting them
    isActive: { 
      type: Boolean, 
      default: true, 
      index: true 
    },

    /* ================================
       PASSWORD RESET FIELDS (NEW)
       ================================ */

    resetPasswordToken: {
      type: String,
      default: null,
      index: true
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },
  { 
  }
);


module.exports = mongoose.models.User || mongoose.model("User", userSchema);
