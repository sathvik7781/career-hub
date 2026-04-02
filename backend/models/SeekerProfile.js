const mongoose = require("mongoose");

const seekerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    basicInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      phone: { type: String, trim: true },
      age: { type: Number },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      gender: { type: String, trim: true },
      profileImageUrl: { type: String, default: null },
      profileImagePublicId: { type: String, default: null },
    },
    education: [
      {
        degree: { type: String, trim: true, required: true },
        institution: { type: String, trim: true, required: true },
        fieldOfStudy: { type: String, trim: true },

        startYear: { type: Number, required: true },
        endYear: { type: Number },
        isPursuing: { type: Boolean, default: false },

        scoreType: {
          type: String,
          enum: ["cgpa", "percentage"],
        },
        scoreValue: { type: Number },
      },
    ],

    professional: {
      headline: { type: String, trim: true },
      careerLevel: {
        type: String,
        enum: ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"],
      },
      summary: { type: String, trim: true },
      noExperience: { type: Boolean, default: false },
    },

    experience: [
      {
        companyName: { type: String, trim: true, required: true },
        jobTitle: { type: String, trim: true, required: true },
        employmentType: {
          type: String,
          enum: ["Full-time", "Internship", "Freelance", "Part-time"],
        },
        location: { type: String, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        currentlyWorking: { type: Boolean, default: false },
        description: { type: String, trim: true },
      },
    ],

    skills: [
      {
        name: { type: String, trim: true, required: true },
      },
    ],

    projects: [
      {
        title: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        techStack: [{ type: String, trim: true }],
        projectUrl: { type: String, trim: true },
        githubUrl: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        currentlyWorking: { type: Boolean, default: false },
      },
    ],

    resumeUrl: { type: String, default: null },
    resumePublicId: { type: String, default: null },
    resumeOriginalName: { type: String, default: null },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    completion: {
      percentage: { type: Number, default: 0 },
      completedSections: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SeekerProfile", seekerProfileSchema);
