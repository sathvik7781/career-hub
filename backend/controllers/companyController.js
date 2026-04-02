const companyService = require("../services/companyService");

// Register a new company
exports.registerCompany = async (req, res, next) => {
  try {
    const company = await companyService.registerCompany(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Company registered successfully. Pending verification.",
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

// Get My Company
exports.getMyCompany = async (req, res, next) => {
  try {
    const company = await companyService.getMyCompany(req.user.id);
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

// Update Company (Owner only)
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(
      req.user.id,
      req.params.companyId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Company updated",
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Verify Company
exports.verifyCompany = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const company = await companyService.verifyCompany(
      req.params.companyId,
      status,
      rejectionReason,
    );
    res.status(200).json({
      success: true,
      message: `Company ${status}`,
      data: company,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.companyId);
    res.status(200).json({ success: true, data: company });
  } catch (err) { next(err); }
};

// Get All Companies (Public or Admin with filters)
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies({
      ...req.query,
      adminView: req.path === "/admin/all",
    });
    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (err) {
    next(err);
  }
};

// Request to join a company
exports.requestToJoinCompany = async (req, res, next) => {
  try {
    await companyService.requestToJoinCompany(req.user.id, req.params.companyId);
    res.status(200).json({
      success: true,
      message: "Join request sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get Join Requests (Owner only)
exports.getJoinRequests = async (req, res, next) => {
  try {
    const requests = await companyService.getJoinRequests(req.user.id);
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// Respond to Join Request (Owner only)
exports.respondToJoinRequest = async (req, res, next) => {
  try {
    const { recruiterId, status } = req.body;
    await companyService.respondToJoinRequest(req.user.id, recruiterId, status);
    res.status(200).json({
      success: true,
      message: `Request ${status}`,
    });
  } catch (err) {
    next(err);
  }
};

// Leave Company
exports.leaveCompany = async (req, res, next) => {
  try {
    await companyService.leaveCompany(req.user.id);
    res.status(200).json({
      success: true,
      message: "Left company successfully",
    });
  } catch (err) {
    next(err);
  }
};
