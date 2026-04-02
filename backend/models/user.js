const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "recruiter", "seeker"],
      required: true,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    roleProfile: {
      type: String,
      enum: ["SeekerProfile", "RecruiterProfile"],
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
