const express = require("express");
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

router.post("/register/request-otp", requestRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password/request-otp", requestResetOtp);
router.post("/forgot-password/verify-otp", verifyResetOtp);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;
