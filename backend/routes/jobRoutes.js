const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  postJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob,
  adminDeleteJob, adminGetAllJobs,
} = require("../controllers/jobController");

const { validate, validateJob } = require("../middleware/validator");
const requireRole = require("../middleware/roleMiddleware");

// Public — list
router.get("/", getJobs);

// Named routes BEFORE /:id — otherwise "admin" and "recruiter" match as job IDs
router.get("/admin/all",      authMiddleware, requireRole("admin"),     adminGetAllJobs);
router.delete("/admin/:jobId", authMiddleware, requireRole("admin"),    adminDeleteJob);
router.get("/recruiter/me",   authMiddleware, requireRole("recruiter"), getMyJobs);

// Public — single job (parameterized — must be after all named GET routes)
router.get("/:id", getJobById);

// Recruiter mutations
router.post("/",       authMiddleware, requireRole("recruiter"), validateJob, validate, postJob);
router.put("/:jobId",  authMiddleware, requireRole("recruiter"), updateJob);
router.delete("/:jobId", authMiddleware, requireRole("recruiter"), deleteJob);

module.exports = router;
