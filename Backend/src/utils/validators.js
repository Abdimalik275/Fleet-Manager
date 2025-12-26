/**
 * Validate email using regex
 */
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Validate password strength
   * - Minimum 8 characters
   * - At least one uppercase
   * - At least one lowercase
   * - At least one number
   * - At least one special character
   */
  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  
  module.exports = {
    isValidEmail,
    isValidPassword
  };
  