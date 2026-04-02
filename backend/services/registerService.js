const User = require("../models/user");
const Otp = require("../models/Otp");
const SeekerProfile = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const bcrypt = require("bcryptjs");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const AppError = require("../utils/appError");
const { validatePassword } = require("../utils/passwordValidator");

exports.requestRegisterOtp = async (email) => {
  const normalizedEmail = email?.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new AppError("User already exists", 409);
  await sendOtp(normalizedEmail, "register");
  return "OTP sent successfully";
};

exports.verifyRegisterOtp = async (email, otp) => {
  if (!email || !otp) throw new AppError("Email and OTP are required", 400);
  await verifyOtp(email.toLowerCase().trim(), otp, "register");
  return "OTP verified successfully";
};

exports.register = async (email, password, role) => {
  if (!email || !password || !role) throw new AppError("All fields are required", 400);
  const normalizedEmail = email.toLowerCase().trim();

  const allowedRoles = ["recruiter", "seeker"];
  if (!allowedRoles.includes(role)) throw new AppError("Invalid role", 400);
  validatePassword(password);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new AppError("User already exists", 409);

  const verifiedOtp = await Otp.findOne({
    email: normalizedEmail,
    purpose: "register",
    verifiedAt: { $ne: null },
    expiresAt: { $gt: new Date() },
  });
  if (!verifiedOtp) {
    throw new AppError("Please verify your email with OTP before registering", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isProfileComplete: false,
    roleProfile: role === "seeker" ? "SeekerProfile" : "RecruiterProfile",
  });

  if (role === "seeker") {
    await SeekerProfile.create({
      user: user._id,
      completion: { percentage: 0, completedSections: [] },
    });
  } else {
    await RecruiterProfile.create({
      user: user._id,
      roleInCompany: "Recruiter",
    });
  }

  await Otp.deleteMany({ email: normalizedEmail, purpose: "register" });
  return user;
};
