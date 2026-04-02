const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  requestRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  refreshToken,
  logout,
  requestResetOtp,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/authController");

const rateLimitResponse = (res, message) =>
  res.status(429).json({ success: false, message });

// 10 attempts per 15 min — brute force protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, "Too many login attempts. Please try again in 15 minutes."),
});

// 5 OTP sends per 30 min — prevents OTP spam / email flooding
const otpRequestLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, "Too many OTP requests. Please try again in 30 minutes."),
});

// 15 attempts per 15 min — covers verify + register + reset submit
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => rateLimitResponse(res, "Too many attempts. Please try again in 15 minutes."),
});

router.post("/register/request-otp", otpRequestLimiter, requestRegisterOtp);
router.post("/register/verify-otp", otpVerifyLimiter, verifyRegisterOtp);
router.post("/register", otpVerifyLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password/request-otp", otpRequestLimiter, requestResetOtp);
router.post("/forgot-password/verify-otp", otpVerifyLimiter, verifyResetOtp);
router.post("/forgot-password/reset", otpVerifyLimiter, resetPassword);

module.exports = router;
