const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    roleInCompany: {
      type: String,
      enum: ["Owner", "Recruiter"], // Based on spec requirements
      default: "Recruiter",
    },
    designation: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RecruiterProfile", recruiterProfileSchema);
