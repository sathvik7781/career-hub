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
  await transporter.sendMail({
    from: `"Career Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email verification OTP",
    html: `
      <h2>Your OTP code is: <strong>${otp}</strong></h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

module.exports = {
  sendOtpEmail,
};
