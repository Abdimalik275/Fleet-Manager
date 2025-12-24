const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * JWT authentication middleware
 * - Verifies token
 * - Attaches user info to req.user
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid or inactive user" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
