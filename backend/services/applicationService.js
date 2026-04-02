const Application = require("../models/Application");
const SeekerProfile = require("../models/SeekerProfile");
const Job = require("../models/Job");
const RecruiterProfile = require("../models/RecruiterProfile");
const AppError = require("../utils/appError");
const notificationService = require("./notificationService");

exports.applyToJob = async (userId, jobId) => {
  const seeker = await SeekerProfile.findOne({ user: userId });
  if (!seeker) throw new AppError("Seeker profile not found", 404);
  if (!seeker.resumeUrl) throw new AppError("Resume is required to apply", 400);

  const job = await Job.findById(jobId);
  if (!job || job.isDeleted) throw new AppError("Job not found", 404);
  if (job.status !== "active") throw new AppError("This job is no longer accepting applications", 400);

  const existing = await Application.findOne({ job: jobId, applicant: seeker._id });
  if (existing) throw new AppError("You have already applied to this job", 400);

  const application = await Application.create({
    job: jobId,
    applicant: seeker._id,
    resume: seeker.resumeUrl,
    status: "applied",
  });

  const recruiterProfile = await RecruiterProfile.findById(job.recruiter);
  if (recruiterProfile) {
    notificationService.createNotification(
      recruiterProfile.user,
      "new_application",
      "New Job Application",
      `Someone just applied for ${job.title}`,
      `/recruiter/jobs/${jobId}/applications`
    ).catch(err => console.error("Notification failed", err));
  }

  return application;
};

exports.getMyApplications = async (userId) => {
  const seeker = await SeekerProfile.findOne({ user: userId });
  if (!seeker) throw new AppError("Seeker profile not found", 404);

  return await Application.find({ applicant: seeker._id })
    .populate({ path: "job", populate: { path: "company", select: "name logo" } })
    .sort({ createdAt: -1 })
    .lean();
};

exports.getJobApplications = async (userId, jobId) => {
  const [job, recruiter] = await Promise.all([
    Job.findById(jobId),
    RecruiterProfile.findOne({ user: userId }),
  ]);
  if (!job) throw new AppError("Job not found", 404);
  if (!recruiter || job.recruiter.toString() !== recruiter._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  return await Application.find({ job: jobId })
    .populate("applicant", "basicInfo education experience skills")
    .sort({ createdAt: -1 })
    .lean();
};

exports.updateApplicationStatus = async (userId, applicationId, status) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new AppError("Application not found", 404);

  const [job, recruiter] = await Promise.all([
    Job.findById(application.job),
    RecruiterProfile.findOne({ user: userId }),
  ]);
  if (!recruiter || job.recruiter.toString() !== recruiter._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  application.status = status;
  await application.save();

  // Notify the Seeker asynchronously
  const applicantProfile = await SeekerProfile.findById(application.applicant);
  if (applicantProfile) {
    notificationService.createNotification(
      applicantProfile.user,
      "application_update",
      "Application Status Update",
      `Your application for ${job.title} has been marked as ${status}.`,
      "/my-applications"
    ).catch(err => console.error("Notification failed", err));
  }

  return application;
};
