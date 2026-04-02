const Job = require("../models/Job");
const Company = require("../models/Company");
const RecruiterProfile = require("../models/RecruiterProfile");
const AppError = require("../utils/appError");
const redis = require("../utils/cache");

exports.postJob = async (userId, jobData) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter?.company) throw new AppError("You must be part of a company to post jobs", 403);

  const company = await Company.findById(recruiter.company);
  if (!company) throw new AppError("Company not found", 404);
  if (company.verificationStatus !== "approved") {
    throw new AppError(`Company is ${company.verificationStatus}. Cannot post jobs.`, 403);
  }

  return await Job.create({ ...jobData, company: company._id, recruiter: recruiter._id, status: "active" });
};

exports.getJobs = async (query) => {
  const { keyword, location, type, experienceLevel, minSalary, maxSalary, page = 1, limit = 20, adminView } = query;

  const cacheKey = `jobs:${JSON.stringify(query)}`;
  if (!adminView) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // Ignore cache errors
    }
  }

  let filter = { isDeleted: false };

  if (!adminView) {
    const approvedCompanyIds = await Company.find({ verificationStatus: "approved", isDeleted: false })
      .select("_id").lean().then((c) => c.map((c) => c._id));
    filter.company = { $in: approvedCompanyIds };
    filter.status = "active";
  }

  if (keyword) filter.$text = { $search: keyword };
  if (location) filter.location = { $regex: location, $options: "i" };
  if (type) filter.type = type;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (minSalary) filter["salary.min"] = { $gte: Number(minSalary) };
  if (maxSalary) filter["salary.max"] = { $lte: Number(maxSalary) };
  if (query.company) filter.company = query.company;

  const skip = (page - 1) * limit;
  
  // Projection and Sort for text search
  const projection = keyword ? { score: { $meta: "textScore" } } : {};
  const sortQuery = keyword ? { score: { $meta: "textScore" } } : { createdAt: -1 };

  const [data, total] = await Promise.all([
    Job.find(filter, projection).populate("company", "name logo location").sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    Job.countDocuments(filter),
  ]);

  const result = { data, total, page: Number(page), totalPages: Math.ceil(total / limit) };
  
  if (!adminView) {
    // Cache the result for 60 seconds
    try {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    } catch (e) {
      // Ignore cache errors
    }
  }

  return result;
};

exports.getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate("company").populate("recruiter").lean();
  if (!job || job.isDeleted) throw new AppError("Job not found", 404);
  return job;
};

exports.getMyJobs = async (userId) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter) throw new AppError("Recruiter profile not found", 404);
  return await Job.find({ recruiter: recruiter._id, isDeleted: false }).sort({ createdAt: -1 }).lean();
};

exports.updateJob = async (userId, jobId, updates) => {
  const [job, recruiter] = await Promise.all([
    Job.findById(jobId),
    RecruiterProfile.findOne({ user: userId }),
  ]);
  if (!job) throw new AppError("Job not found", 404);
  if (!recruiter || job.recruiter.toString() !== recruiter._id.toString()) {
    throw new AppError("Unauthorized to edit this job", 403);
  }
  return await Job.findByIdAndUpdate(jobId, updates, { new: true });
};

exports.deleteJob = async (userId, jobId) => {
  const [job, recruiter] = await Promise.all([
    Job.findById(jobId),
    RecruiterProfile.findOne({ user: userId }),
  ]);
  if (!job) throw new AppError("Job not found", 404);
  if (!recruiter || job.recruiter.toString() !== recruiter._id.toString()) {
    throw new AppError("Unauthorized to delete this job", 403);
  }
  return await Job.findByIdAndUpdate(jobId, { isDeleted: true, status: "closed" }, { new: true });
};

exports.adminDeleteJob = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) throw new AppError("Job not found", 404);
  return await Job.findByIdAndUpdate(jobId, { isDeleted: true, status: "closed" }, { new: true });
};
