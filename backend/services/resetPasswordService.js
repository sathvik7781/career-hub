const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const { validatePassword } = require("../utils/passwordValidator");
const AppError = require("../utils/appError");

exports.requestResetOtp = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email:email.toLowercase().trim() });
  if (user) {
    await sendOtp(email, "reset");
  }

  return "If the email exists, an OTP has been sent.";
};

exports.verifyResetOtp = async (email, otp) => {
  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }

  await verifyOtp(email, otp, "reset");
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  await user.save();

  return resetToken;
};

exports.resetPassword = async (email, newPassword, resetToken) => {
  if (!email || !newPassword || !resetToken) {
    throw new AppError(
      "Email, new password, and reset token are required",
      400,
    );
  }

  validatePassword(newPassword);

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    email,
    resetToken: hashedToken,
    resetTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Reset token is invalid or has expired.", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError("New password must be different from old password", 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);

  user.passwordChangedAt = Date.now() - 1000;

  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;

  await user.save();

  return "Password reset successful.";
};
