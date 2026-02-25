require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};
