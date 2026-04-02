const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { validate, validateApplication } = require("../middleware/validator");
const requireRole = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// Seeker
router.post("/apply", requireRole("seeker"), validateApplication, validate, applyToJob);
router.get("/me", requireRole("seeker"), getMyApplications);

// Recruiter
router.get("/job/:jobId", requireRole("recruiter"), getJobApplications);
router.put("/status/:applicationId", requireRole("recruiter"), updateApplicationStatus);

module.exports = router;
