const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * ======================================================
 * CREATE USER
 * ======================================================
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const requesterRole = req.user.role;

    if (!name || !email || !password || !role) return res.status(400).json({ message: "All fields are required" });

    if (role === "super_admin") return res.status(403).json({ message: "Cannot create Super Admin" });
    if (requesterRole === "operator") return res.status(403).json({ message: "Operator cannot create users" });
    if (requesterRole === "admin" && role !== "operator") return res.status(403).json({ message: "Admin can only create operators" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 12);

    const user = await User.create({ name, email, password: hashedPassword, role, isActive: true });

    return res.status(201).json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ======================================================
 * UPDATE USER
 * ======================================================
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;
    const requesterRole = req.user.role;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "super_admin") return res.status(403).json({ message: "Cannot modify Super Admin" });
    if (requesterRole === "admin" && user.role !== "operator") return res.status(403).json({ message: "Admin can only update operators" });
    if (requesterRole === "operator") return res.status(403).json({ message: "Operator cannot update users" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (password) user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
    if (role && requesterRole === "super_admin") user.role = role;

    await user.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ======================================================
 * GET ALL USERS
 * ======================================================
 */
exports.getAllUsers = async (req, res) => {
  try {
    const requesterRole = req.user.role;

    if (requesterRole === "operator") {
      return res.status(403).json({ message: "Operator cannot view users" });
    }

    let filter = {};

    // Admin can only view operators
    if (requesterRole === "admin") {
      filter.role = "operator";
    }

    const users = await User.find(filter).select("-password");

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * ======================================================
 * GET USER BY ID
 * ======================================================
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterRole = req.user.role;

    if (requesterRole === "operator") {
      return res.status(403).json({ message: "Operator cannot view users" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admin can only view operators
    if (requesterRole === "admin" && user.role !== "operator") {
      return res.status(403).json({ message: "Admin can only view operators" });
    }

    // Prevent viewing Super Admin
    if (user.role === "super_admin" && requesterRole !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
















/**
 * ======================================================
 * DELETE USER
 * ======================================================
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterRole = req.user.role;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "super_admin") return res.status(403).json({ message: "Cannot delete Super Admin" });
    if (requesterRole === "admin" && user.role !== "operator") return res.status(403).json({ message: "Admin can only delete operators" });
    if (requesterRole === "operator") return res.status(403).json({ message: "Operator cannot delete users" });

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
