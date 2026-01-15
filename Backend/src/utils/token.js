import crypto from "crypto";

// Generates a secure reset token
export const generateResetToken = () => {
  // Create random string
  const token = crypto.randomBytes(32).toString("hex");

  // Hash the token so raw token is never stored
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Return both versions
  return { token, hashedToken };
};
