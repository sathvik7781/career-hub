const User = require("../models/user");
const bcrypt = require("bcryptjs");
const tokenService = require("../utils/tokenService");
const AppError = require("../utils/appError");

exports.login = async (email, password) => {
  if (!email || !password) throw new AppError("Email and password required", 400);

  const user = await User.findOne({ email: email.toLowerCase().trim(), isActive: true });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const { accessToken, refreshToken } = tokenService.generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  let profileImageUrl = null;
  if (user.role === "seeker") {
    const SeekerProfile = require("../models/SeekerProfile");
    const profile = await SeekerProfile.findOne({ user: user._id }).select("basicInfo.profileImageUrl");
    profileImageUrl = profile?.basicInfo?.profileImageUrl ?? null;
  }

  return {
    accessToken,
    refreshToken,
    role: user.role,
    id: user._id,
    email: user.email,
    isProfileComplete: user.isProfileComplete,
    profileImageUrl,
  };
};

exports.refreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new AppError("Refresh token required", 401);

  const decoded = tokenService.verifyRefreshToken(incomingRefreshToken);

  const user = await User.findOne({ _id: decoded.id, isActive: true });
  if (!user) throw new AppError("User not found", 404);

  if (user.refreshToken !== incomingRefreshToken) {
    user.refreshToken = null;
    await user.save();
    throw new AppError("Refresh token reuse detected. Please log in again.", 401);
  }

  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < changedTimestamp) {
      throw new AppError("Password recently changed. Please log in again.", 401);
    }
  }

  const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens(user);
  user.refreshToken = newRefreshToken;
  await user.save();

  // Fetch profile image so the frontend avatar survives page refresh
  let profileImageUrl = null;
  if (user.role === "seeker") {
    const SeekerProfile = require("../models/SeekerProfile");
    const profile = await SeekerProfile.findOne({ user: user._id }).select("basicInfo.profileImageUrl");
    profileImageUrl = profile?.basicInfo?.profileImageUrl ?? null;
  }

  return {
    accessToken,
    refreshToken: newRefreshToken,
    id: user._id,
    email: user.email,
    role: user.role,
    isProfileComplete: user.isProfileComplete,
    profileImageUrl,
  };
};
