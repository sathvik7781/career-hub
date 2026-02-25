const User = require("../models/user");
const bcrypt = require("bcryptjs");
const tokenService = require("../utils/tokenService");
const AppError = require("../utils/appError");

exports.login = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const { accessToken, refreshToken } = tokenService.generateTokens(user);

  return {
    accessToken,
    refreshToken,
    role: user.role,
    id: user._id,
    isProfileComplete: user.isProfileComplete,
  };
};

exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }
  const decoded = tokenService.verifyRefreshToken(refreshToken);
  const foundUser = await User.findOne({
    _id: decoded.id,
    isActive: true,
  });
  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  if (foundUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      foundUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (decoded.iat < changedTimestamp) {
      throw new AppError(
        "User recently changed password! Please log in again.",
        401,
      );
    }
  }

  const newAccessToken = tokenService.generateAccessToken(foundUser);
  return {
    accessToken: newAccessToken,
    id: foundUser._id,
    email: foundUser.email,
    role: foundUser.role,
    isProfileComplete: foundUser.isProfileComplete,
  };
};
