const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SeekerProfile",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "interview",
        "offer",
        "rejected",
        "hired",
      ],
      default: "applied",
    },
    resume: {
      type: String, // URL to resume file or ID
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications for the same job by the same seeker
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
