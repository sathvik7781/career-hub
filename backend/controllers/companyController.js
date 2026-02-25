const Company = require("../models/Company");
const RecruiterProfile = require("../models/RecruiterProfile");
const User = require("../models/user");

// Register a new company
exports.registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already registered" });
    }

    // Get Recruiter Profile
    const recruiterProfile = await RecruiterProfile.findOne({
      user: req.user.id,
    });
    if (!recruiterProfile) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    if (recruiterProfile.company) {
      return res.status(400).json({ message: "You already have a company" });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      owner: recruiterProfile._id,
      verificationStatus: "pending",
    });

    // Update Recruiter Profile
    recruiterProfile.company = company._id;
    recruiterProfile.roleInCompany = "Owner";
    await recruiterProfile.save();

    res.status(201).json({
      message: "Company registered successfully. Pending verification.",
      company,
    });
  } catch (err) {
    console.log("REGISTER COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Company
exports.getMyCompany = async (req, res) => {
  try {
    const recruiter = await RecruiterProfile.findOne({
      user: req.user.id,
    }).populate("company");
    if (!recruiter || !recruiter.company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ company: recruiter.company });
  } catch (err) {
    console.log("GET COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Company (Owner only)
exports.updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updates = req.body;

    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });

    if (!recruiter || recruiter.roleInCompany !== "Owner") {
      return res
        .status(403)
        .json({ message: "Only the owner can update company details" });
    }

    if (recruiter.company.toString() !== companyId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const company = await Company.findByIdAndUpdate(companyId, updates, {
      new: true,
    });

    res.json({ message: "Company updated", company });
  } catch (err) {
    console.log("UPDATE COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Verify Company
exports.verifyCompany = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { companyId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "rejected" && !rejectionReason) {
      return res
        .status(400)
        .json({ message: "Rejection reason is required for rejection" });
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        verificationStatus: status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
      },
      { new: true },
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: `Company ${status}`, company });
  } catch (err) {
    console.log("VERIFY COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Companies (Public or Admin with filters)
exports.getCompanies = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { isDeleted: false };

    if (status) {
      filter.verificationStatus = status;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const companies = await Company.find(filter)
      .populate("owner", "user")
      .select("-joinRequests"); // Hide requests from public list
    res.json({ companies });
  } catch (err) {
    console.log("GET COMPANIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Request to join a company
exports.requestToJoinCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    if (recruiter.company) {
      return res.status(400).json({ message: "You are already in a company" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.joinRequests.includes(recruiter._id)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    company.joinRequests.push(recruiter._id);
    await company.save();

    res.json({ message: "Join request sent successfully" });
  } catch (err) {
    console.log("JOIN REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Join Requests (Owner only)
exports.getJoinRequests = async (req, res) => {
  try {
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiter || !recruiter.company || recruiter.roleInCompany !== "Owner") {
      return res.status(403).json({ message: "Authorized for company owners only" });
    }

    const company = await Company.findById(recruiter.company).populate({
      path: "joinRequests",
      populate: { path: "user", select: "name email" }
    });

    res.json({ requests: company.joinRequests });
  } catch (err) {
    console.log("GET REQUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Respond to Join Request (Owner only)
exports.respondToJoinRequest = async (req, res) => {
  try {
    const { recruiterId, status } = req.body; // status: 'approved' or 'rejected'
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });

    if (!recruiter || !recruiter.company || recruiter.roleInCompany !== "Owner") {
      return res.status(403).json({ message: "Authorized for company owners only" });
    }

    const company = await Company.findById(recruiter.company);

    if (!company.joinRequests.includes(recruiterId)) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status === "approved") {
      const applicant = await RecruiterProfile.findById(recruiterId);
      if (applicant.company) {
          // Clean up if they joined another one in meantime
          company.joinRequests = company.joinRequests.filter(id => id.toString() !== recruiterId);
          await company.save();
          return res.status(400).json({ message: "Recruiter already joined another company" });
      }

      applicant.company = company._id;
      applicant.roleInCompany = "Recruiter";
      await applicant.save();
    }

    // Remove from requests in both cases
    company.joinRequests = company.joinRequests.filter(id => id.toString() !== recruiterId);
    await company.save();

    res.json({ message: `Request ${status}` });
  } catch (err) {
    console.log("RESPOND REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave Company
exports.leaveCompany = async (req, res) => {
  try {
    const recruiter = await RecruiterProfile.findOne({ user: req.user.id });

    if (!recruiter || !recruiter.company) {
      return res.status(400).json({ message: "You are not in a company" });
    }

    if (recruiter.roleInCompany === "Owner") {
       // Check if there are other recruiters to transfer ownership? For now, prevent leaving if owner.
       // Or delete company? Let's prevent leaving for simplicity for now.
       return res.status(400).json({ message: "Owners cannot leave. Please delete the company or transfer ownership." });
    }

    recruiter.company = null;
    recruiter.roleInCompany = "Recruiter"; // Reset role
    await recruiter.save();

    res.json({ message: "Left company successfully" });
  } catch (err) {
    console.log("LEAVE COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
