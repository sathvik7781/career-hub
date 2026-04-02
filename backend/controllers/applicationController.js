const applicationService = require("../services/applicationService");
const { logAction } = require("../utils/auditLogger");

exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId, resume } = req.body;
    const application = await applicationService.applyToJob(
      req.user.id,
      jobId,
      resume,
    );
    await logAction({
      userId: req.user.id,
      action: "APPLICATION_SUBMITTED",
      entityType: "Application",
      entityId: application._id,
      details: { jobId },
      req,
    });
    res.status(201).json({
      success: true,
      message: "Application submitted",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.id);
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getJobApplications(
      req.user.id,
      req.params.jobId,
    );
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.user.id,
      req.params.applicationId,
      status,
    );
    await logAction({
      userId: req.user.id,
      action: "APPLICATION_STATUS_CHANGED",
      entityType: "Application",
      entityId: application._id,
      details: { newStatus: status },
      req,
    });
    res.status(200).json({
      success: true,
      message: "Status updated",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

