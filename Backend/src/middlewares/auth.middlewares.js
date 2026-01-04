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
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // IMPORTANT: match the field you used when signing the token
    // If you signed with { id: user._id }, use decoded.id
    // If you signed with { _id: user._id }, use decoded._id
    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid or inactive user" });
    }

    // Attach user info to request
    req.user = { id: user._id.toString(), role: user.role };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};