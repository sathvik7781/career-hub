require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Career Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your CareerHub verification code",
      html: `
        <h2>Your OTP code is: <strong>${otp}</strong></h2>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      `,
    });
  } catch (err) {
    console.error("Mail send failed:", err.message);
    throw new Error("Failed to send OTP email. Please try again.");
  }
};

module.exports = {
  sendOtpEmail,
};
