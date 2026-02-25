const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// Seeker
router.post("/apply", authMiddleware, applyToJob);
router.get("/me", authMiddleware, getMyApplications);

// Recruiter
router.get("/job/:jobId", authMiddleware, getJobApplications);
router.put("/status/:applicationId", authMiddleware, updateApplicationStatus);

module.exports = router;
