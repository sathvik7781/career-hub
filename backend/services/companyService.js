const Company = require("../models/Company");
const RecruiterProfile = require("../models/RecruiterProfile");
const AppError = require("../utils/appError");

exports.registerCompany = async (userId, companyData) => {
  const { name, description, website, location } = companyData;
  if (!name) throw new AppError("Company name is required", 400);

  const existing = await Company.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
  if (existing) throw new AppError("Company already registered", 400);

  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter) throw new AppError("Recruiter profile not found", 404);
  if (recruiter.company) throw new AppError("You already have a company", 400);

  const company = await Company.create({
    name,
    description,
    website,
    location,
    owner: recruiter._id,
    verificationStatus: "pending",
  });

  recruiter.company = company._id;
  recruiter.roleInCompany = "Owner";
  await recruiter.save();

  return company;
};

exports.getMyCompany = async (userId) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId }).populate("company");
  if (!recruiter?.company) throw new AppError("Company not found", 404);
  return recruiter.company;
};

exports.updateCompany = async (userId, companyId, updates) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter || recruiter.roleInCompany !== "Owner") {
    throw new AppError("Only the owner can update company details", 403);
  }
  if (recruiter.company.toString() !== companyId) {
    throw new AppError("Unauthorized action", 403);
  }
  return await Company.findByIdAndUpdate(companyId, updates, { new: true });
};

exports.verifyCompany = async (companyId, status, rejectionReason) => {
  if (!["approved", "rejected", "suspended"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }
  if (status === "rejected" && !rejectionReason) {
    throw new AppError("Rejection reason is required for rejection", 400);
  }
  const company = await Company.findByIdAndUpdate(
    companyId,
    { verificationStatus: status, rejectionReason: status === "rejected" ? rejectionReason : null },
    { new: true },
  );
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

exports.getCompanyById = async (companyId) => {
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
    verificationStatus: "approved",
  });
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

exports.getCompanies = async (query) => {
  const { status, search, adminView } = query;
  const filter = { isDeleted: false };
  if (adminView) {
    if (status) filter.verificationStatus = status;
  } else {
    filter.verificationStatus = "approved";
  }
  if (search) filter.name = { $regex: search, $options: "i" };

  return await Company.find(filter)
    .populate({ path: "owner", populate: { path: "user", select: "email" } })
    .sort({ createdAt: -1 });
};

exports.requestToJoinCompany = async (userId, companyId) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter) throw new AppError("Recruiter profile not found", 404);
  if (recruiter.company) throw new AppError("You are already in a company", 400);

  const company = await Company.findById(companyId);
  if (!company) throw new AppError("Company not found", 404);
  if (company.joinRequests.includes(recruiter._id)) {
    throw new AppError("Request already sent", 400);
  }

  company.joinRequests.push(recruiter._id);
  await company.save();
  return true;
};

exports.getJoinRequests = async (userId) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter?.company || recruiter.roleInCompany !== "Owner") {
    throw new AppError("Authorized for company owners only", 403);
  }
  const company = await Company.findById(recruiter.company).populate({
    path: "joinRequests",
    populate: { path: "user", select: "email" },
  });
  return company.joinRequests;
};

exports.respondToJoinRequest = async (userId, recruiterId, status) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter?.company || recruiter.roleInCompany !== "Owner") {
    throw new AppError("Authorized for company owners only", 403);
  }

  const company = await Company.findById(recruiter.company);
  if (!company.joinRequests.includes(recruiterId)) {
    throw new AppError("Request not found", 404);
  }

  if (status === "approved") {
    const applicant = await RecruiterProfile.findById(recruiterId);
    if (applicant.company) {
      company.joinRequests = company.joinRequests.filter((id) => id.toString() !== recruiterId);
      await company.save();
      throw new AppError("Recruiter already joined another company", 400);
    }
    applicant.company = company._id;
    applicant.roleInCompany = "Recruiter";
    await applicant.save();
  }

  company.joinRequests = company.joinRequests.filter((id) => id.toString() !== recruiterId);
  await company.save();
  return true;
};

exports.leaveCompany = async (userId) => {
  const recruiter = await RecruiterProfile.findOne({ user: userId });
  if (!recruiter?.company) throw new AppError("You are not in a company", 400);
  if (recruiter.roleInCompany === "Owner") {
    throw new AppError("Owners cannot leave. Please delete the company or transfer ownership.", 400);
  }
  recruiter.company = null;
  recruiter.roleInCompany = "Recruiter";
  await recruiter.save();
  return true;
};
