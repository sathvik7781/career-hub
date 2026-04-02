const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const buildAccessPayload = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
  isProfileComplete: user.isProfileComplete,
});

exports.generateAccessToken = (user) =>
  jwt.sign(buildAccessPayload(user), process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

exports.generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

exports.generateTokens = (user) => ({
  accessToken: exports.generateAccessToken(user),
  refreshToken: exports.generateRefreshToken(user),
});

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
