const Job = require("../models/Job");
const RecruiterProfile = require("../models/RecruiterProfile");
const Company = require("../models/Company");

exports.postJob = async (req, res) => {
  try {
    // 1. Get Recruiter
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiter || !recruiter.company) {
      return res
        .status(403)
        .json({ message: "You must be part of a company to post jobs" });
    }

    // 2. Check Company Status
    const company = await Company.findById(recruiter.company);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.verificationStatus !== "approved") {
      return res.status(403).json({
        message: `Company is ${company.verificationStatus}. Cannot post jobs.`,
      });
    }

    // 3. Create Job
    const job = await Job.create({
      ...req.body,
      company: company._id,
      recruiter: recruiter._id,
      status: "active",
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.log("POST JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;
    const filter = { status: "active", isDeleted: false };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (type) {
      filter.type = type;
    }

    // Find jobs and populate company
    // CRITICAL: We need to filter out jobs where company is NOT approved.
    // Mongoose doesn't support filtering on populated fields easily in allowed `find` query.
    // Efficient way: Find all approved companies first, then find jobs for those companies.

    const approvedCompanies = await Company.find({
      verificationStatus: "approved",
      isDeleted: false,
    }).select("_id");
    
    const approvedCompanyIds = approvedCompanies.map((c) => c._id);
    filter.company = { $in: approvedCompanyIds };

    const jobs = await Job.find(filter)
      .populate("company", "name logo location")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    console.log("GET JOBS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("recruiter", "designation");

    if (!job || job.isDeleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (err) {
    console.log("GET JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    const jobs = await Job.find({
      recruiter: recruiter._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    console.log("GET MY JOBS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership (simple check: same recruiter or owner of company?)
    // For now, strict: only the poster.
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    
    if (job.recruiter.toString() !== recruiter._id.toString()) {
      // Allow if Owner of the company?
      // For now, simple strict check.
       return res.status(403).json({ message: "Unauthorized to edit this job" });
    }

    Object.assign(job, updates);
    await job.save();

    res.json({ message: "Job updated", job });
  } catch (err) {
    console.log("UPDATE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    
    // Allow deletion if poster or maybe Admin/Owner?
    if (job.recruiter.toString() !== recruiter._id.toString()) {
       return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    job.isDeleted = true;
    job.status = "closed";
    await job.save();

    res.json({ message: "Job deleted (archived)" });
  } catch (err) {
    console.log("DELETE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
