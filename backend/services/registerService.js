const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const AppError = require("../utils/appError");

exports.requestRegisterOtp = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }
  await sendOtp(email, "register");
  return "OTP sent successfully";
};

exports.verifyRegisterOtp = async (email, otp) => {
  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }
  await verifyOtp(email, otp, "register");
  return "OTP verified successfully";
};

exports.register = async (email, password, role) => {
  if (!email || !password || !role) {
    throw new AppError("All fields are required", 400);
  }

  const allowedRoles = ["recruiter", "seeker"];
  if (!allowedRoles.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let roleProfile = null;
  if (role === "seeker") roleProfile = "SeekerProfile";
  if (role === "recruiter") roleProfile = "RecruiterProfile";

  await User.create({
    email,
    password: hashedPassword,
    role,
    isProfileComplete: false,
    roleProfile,
  });

  return "User registered successfully";
};
