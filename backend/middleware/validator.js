const { body, param, validationResult } = require("express-validator");

// 🔹 Middleware to return validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

// 🔹 Basic Info Validation
exports.validateBasicInfo = [
  body("basicInfo")
    .exists()
    .withMessage("Basic info is required")
    .isObject()
    .withMessage("Basic info must be an object"),

  body("basicInfo.firstName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),

  body("basicInfo.lastName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),

  body("basicInfo.phone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone must be 10–15 digits"),

  body("basicInfo.age")
    .optional()
    .isInt({ min: 16, max: 80 })
    .withMessage("Age must be between 16 and 80"),

  body("basicInfo.city").optional().trim().isLength({ max: 100 }),

  body("basicInfo.state").optional().trim().isLength({ max: 100 }),

  body("basicInfo.country").optional().trim().isLength({ max: 100 }),

  body("basicInfo.gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
];
