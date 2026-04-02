const jobService = require("../services/jobService");
const { logAction } = require("../utils/auditLogger");

exports.postJob = async (req, res, next) => {
  try {
    const job = await jobService.postJob(req.user.id, req.body);
    await logAction({
      userId: req.user.id,
      action: "JOB_POSTED",
      entityType: "Job",
      entityId: job._id,
      details: { title: job.title, company: job.company },
      req,
    });

    try {
      const { emailQueue } = require("../utils/queue");
      emailQueue.add("send-job-alerts", {
        type: "SEND_DIGEST",
        payload: {
          emails: [], // In a real scenario, fetch users subscribed to this category
          jobTitle: job.title
        }
      });
    } catch(e) {
      // Background task failures shouldn't break the response
      console.error("Queue error:", e);
    }

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const result = await jobService.getJobs(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getMyJobs(req.user.id);
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.user.id, req.params.jobId, req.body);
    await logAction({
      userId: req.user.id,
      action: "JOB_UPDATED",
      entityType: "Job",
      entityId: job._id,
      details: Object.keys(req.body),
      req,
    });

    res.status(200).json({
      success: true,
      message: "Job updated",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.user.id, req.params.jobId);
    await logAction({
      userId: req.user.id,
      action: "JOB_DELETED",
      entityType: "Job",
      entityId: req.params.jobId,
      req,
    });

    res.status(200).json({
      success: true,
      message: "Job deleted (archived)",
    });
  } catch (err) {
    next(err);
  }
};

exports.adminDeleteJob = async (req, res, next) => {
  try {
    await jobService.adminDeleteJob(req.params.jobId);
    res.status(200).json({ success: true, message: "Job removed by admin" });
  } catch (err) {
    next(err);
  }
};

exports.adminGetAllJobs = async (req, res, next) => {
  try {
    const result = await jobService.getJobs({ ...req.query, adminView: true });
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: { total: result.total, page: result.page, totalPages: result.totalPages },
    });
  } catch (err) {
    next(err);
  }
};
