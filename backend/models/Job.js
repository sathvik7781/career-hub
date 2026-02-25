const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "archived"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
