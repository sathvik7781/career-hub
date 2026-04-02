const AppError = require("../utils/appError");

const requireProfileComplete = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role === "seeker" && !req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      code: "PROFILE_INCOMPLETE",
      message: "Please complete your profile to perform this action",
    });
  }

  next();
};

module.exports = requireProfileComplete;
