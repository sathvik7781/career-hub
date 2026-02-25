const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  postJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// Public
router.get("/", getJobs);
router.get("/:id", getJobById);

// Recruiter
router.post("/", authMiddleware, postJob);
router.get("/recruiter/me", authMiddleware, getMyJobs);
router.put("/:jobId", authMiddleware, updateJob);
router.delete("/:jobId", authMiddleware, deleteJob);

module.exports = router;
