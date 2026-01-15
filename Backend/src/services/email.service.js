import nodemailer from "nodemailer";

// Create transporter using Zoho SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",     // Zoho SMTP server
  port: 465,                // Secure SSL port
  secure: true,             // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Zoho email
    pass: process.env.EMAIL_PASS  // App password
  }
});

// Reusable email sending function
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Fleet Manager" <${process.env.EMAIL_USER}>`, // Sender name
    to,         // Receiver
    subject,    // Email subject
    html        // HTML content
  });
};
