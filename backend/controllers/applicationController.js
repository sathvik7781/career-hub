const Application = require("../models/Application");
const Job = require("../models/Job");
const SeekerProfile = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    // Resume is optional in body if it's already in profile, but model says 'required' string.
    // We assume frontend sends the resume URL or ID selected.
    const { resume } = req.body; 

    // Get Seeker Profile
    const seeker = await SeekerProfile.findOne({ user: req.user.id });
    if (!seeker) {
      return res.status(404).json({ message: "Seeker profile not found" });
    }
    
    // If resume not provided in body, try to use default from profile
    const resumeToUse = resume || seeker.resumeFileId;
    if (!resumeToUse) {
        return res.status(400).json({ message: "Resume is required" });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job: jobId,
      applicant: seeker._id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: seeker._id,
      resume: resumeToUse.toString(),
      status: "applied",
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.log("APPLY JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const seeker = await SeekerProfile.findOne({ user: req.user.id });
    if (!seeker) {
      return res.status(404).json({ message: "Seeker profile not found" });
    }

    const applications = await Application.find({ applicant: seeker._id })
      .populate({
        path: "job",
        populate: { path: "company", select: "name logo" },
      })
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.log("GET MY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify Recruiter owns the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    if (job.recruiter.toString() !== recruiter._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "basicInfo education experience skills")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.log("GET JOB APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

    // Verify Recruiter owns the job
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    if (application.job.recruiter.toString() !== recruiter._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated", application });
  } catch (err) {
    console.log("UPDATE APP STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
