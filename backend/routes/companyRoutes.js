const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerCompany,
  getMyCompany,
  updateCompany,
  verifyCompany,
  getCompanies,
  getCompanyById,
  requestToJoinCompany,
  getJoinRequests,
  respondToJoinRequest,
  leaveCompany
} = require("../controllers/companyController");

const { validate, validateCompany } = require("../middleware/validator");
const requireRole = require("../middleware/roleMiddleware");

// Admin-only listing
router.get("/admin/all", authMiddleware, requireRole("admin"), getCompanies);

// Public list
router.get("/", getCompanies);

// Recruiter routes
router.post("/register", authMiddleware, requireRole("recruiter"), validateCompany, validate, registerCompany);
router.get("/me", authMiddleware, requireRole("recruiter"), getMyCompany);
router.put("/update/:companyId", authMiddleware, requireRole("recruiter"), updateCompany);

// Join/Leave
router.post("/join/:companyId", authMiddleware, requireRole("recruiter"), requestToJoinCompany);
router.post("/leave", authMiddleware, requireRole("recruiter"), leaveCompany);

// Join Requests (Company Owner)
router.get("/requests", authMiddleware, requireRole("recruiter"), getJoinRequests);
router.post("/respond-request", authMiddleware, requireRole("recruiter"), respondToJoinRequest);

// Admin Routes
router.put("/verify/:companyId", authMiddleware, requireRole("admin"), verifyCompany);

// Public single-company details should be last so it does not shadow named routes
router.get("/:companyId", getCompanyById);

module.exports = router;
