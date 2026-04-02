const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { validate, validateBasicInfo } = require("../middleware/validator");

const {
  getMyProfile,
  basicInfo,
  avatarUpload,
  removeAvatar,
  addEducation,
  updateEducation,
  deleteEducation,
  updateProfessional,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  resumeUpload,
  downloadResume,
  deleteResume,
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require("../controllers/profileController");

const { uploadResume, uploadAvatar } = require("../middleware/uploadMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// Generic profile — accessible by all authenticated roles
router.get("/me", getMyProfile);

// Seeker-only profile segments
router.use(requireRole("seeker"));

// Basic info & avatar
router.post("/basic-info", validateBasicInfo, validate, basicInfo);
router.post("/upload-avatar", uploadAvatar, avatarUpload);
router.delete("/remove-avatar", removeAvatar);

// Education
router.post("/education", addEducation);
router.put("/education/:educationId", updateEducation);
router.delete("/education/:educationId", deleteEducation);

// Professional & Experience
router.put("/professional", updateProfessional);
router.post("/experience", addExperience);
router.put("/experience/:expId", updateExperience);
router.delete("/experience/:expId", deleteExperience);

// Skills & Projects
router.post("/skills", addSkill);
router.delete("/skills/:skillId", deleteSkill);
router.post("/projects", addProject);
router.put("/projects/:projectId", updateProject);
router.delete("/projects/:projectId", deleteProject);

// Resume
router.post("/upload-resume", uploadResume, resumeUpload);
router.get("/resume", downloadResume);
router.delete("/resume", deleteResume);

// Saved Jobs
router.get("/saved-jobs", getSavedJobs);
router.post("/saved-jobs/:jobId", saveJob);
router.delete("/saved-jobs/:jobId", unsaveJob);

module.exports = router;
