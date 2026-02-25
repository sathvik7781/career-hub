const User = require("../models/user");

const requireProfileComplete = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role === "seeker") {
      const user = await User.findById(req.user.id).select("isProfileComplete");

      if (!user?.isProfileComplete) {
        return res.status(403).json({
          success: false,
          code: "PROFILE_INCOMPLETE",
          message: "Please complete your profile to perform this action",
        });
      }
    }

    next();
  } catch (error) {
    console.error("PROFILE COMPLETE MIDDLEWARE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = requireProfileComplete;
