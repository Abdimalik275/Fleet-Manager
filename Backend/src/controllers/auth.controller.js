const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { isValidEmail, isValidPassword } = require("../utils/validators");
const { sendEmail } = require("../utils/email");



/**
 * ======================================================
 * BOOTSTRAP SUPER ADMIN (ONE-TIME)
 * ======================================================
 */
exports.bootstrapSuperAdmin = async (req, res) => {
  try {
    const { bootstrapKey } = req.body;

    if (bootstrapKey !== process.env.SUPER_ADMIN_BOOTSTRAP_KEY) {
      return res.status(403).json({ message: "Invalid bootstrap key" });
    }

    const existing = await User.findOne({ role: "super_admin" });
    if (existing) {
      return res.status(403).json({ message: "Super Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      Number(process.env.BCRYPT_SALT_ROUNDS) || 12
    );

    const superAdmin = await User.create({
      name: "System Owner",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    });

    return res.status(201).json({
      message: "Super Admin created successfully",
      id: superAdmin._id,
    });
  } catch (error) {
    console.error("Bootstrap Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ======================================================
 * LOGIN (ALL ROLES)
 * ======================================================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ======================================================
 * LOGOUT
 * ======================================================
 */
exports.logout = async (req, res) => {
  // Stateless JWT logout, client deletes token
  return res.status(200).json({ message: "Logout successful. Please remove token on client." });
};

/**
 * ======================================================
 * FORGOT PASSWORD (ALL ROLES)
 * ======================================================
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) return res.status(400).json({ message: "Valid email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600 * 1000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = expires;
    await user.save();

    // Send token via email (SMTP or external service)
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    });



    return res.status(200).json({ message: "Password reset token generated. Check your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ======================================================
 * RESET PASSWORD
 * ======================================================
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) return res.status(400).json({ message: "All fields required" });
    if (!isValidPassword(newPassword)) return res.status(400).json({ message: "Password does not meet requirements" });

    const user = await User.findOne({ email, resetToken, resetTokenExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
