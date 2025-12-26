const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};