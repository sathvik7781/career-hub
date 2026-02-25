const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerCompany,
  getMyCompany,
  updateCompany,
  verifyCompany,
  getCompanies,
  requestToJoinCompany,
  getJoinRequests,
  respondToJoinRequest,
  leaveCompany
} = require("../controllers/companyController");

router.post("/register", authMiddleware, registerCompany);
router.get("/me", authMiddleware, getMyCompany);
router.put("/update/:companyId", authMiddleware, updateCompany);

// Join/Leave
router.post("/join/:companyId", authMiddleware, requestToJoinCompany);
router.post("/leave", authMiddleware, leaveCompany);

// Join Requests (Owner)
router.get("/requests", authMiddleware, getJoinRequests);
router.post("/respond-request", authMiddleware, respondToJoinRequest);

// Admin Routes
router.put("/verify/:companyId", authMiddleware, verifyCompany);
router.get("/", getCompanies); // Public list (can add auth if needed for restricted list)

module.exports = router;
