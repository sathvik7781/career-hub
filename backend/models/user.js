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

    profileRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleProfile",
    },

    roleProfile: {
      type: String,
      enum: ["SeekerProfile", "RecruiterProfile", "AdminProfile"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
