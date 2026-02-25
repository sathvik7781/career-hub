const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // URL to image/logo
      default: "",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null, // Required if status is 'rejected'
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true, // First recruiter is the owner
    },
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecruiterProfile",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
