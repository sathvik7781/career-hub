const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { validate, validateBasicInfo } = require("../middleware/validator");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the website", user: req.user });
});

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
} = require("../controllers/profileController");
const {
  uploadResume,
  uploadAvatar,
} = require("../middleware/uploadMiddleware");

router.get("/profile/me", authMiddleware, getMyProfile);

// Basic
router.post(
  "/profile/basic-info",
  authMiddleware,
  validateBasicInfo,
  validate,
  basicInfo,
);
router.post(
  "/profile/upload-avatar",
  authMiddleware,
  uploadAvatar,
  avatarUpload,
);
router.delete("/profile/remove-avatar", authMiddleware, removeAvatar);

// education routes
router.post("/profile/education", authMiddleware, addEducation);
router.put("/profile/education/:educationId", authMiddleware, updateEducation);
router.delete(
  "/profile/education/:educationId",
  authMiddleware,
  deleteEducation,
);
// professional routes
router.put("/profile/professional", authMiddleware, updateProfessional);
router.post("/profile/experience", authMiddleware, addExperience);
router.put(
  "/profile/experience/:experienceId",
  authMiddleware,
  updateExperience,
);
router.delete(
  "/profile/experience/:experienceId",
  authMiddleware,
  deleteExperience,
);

// Skills
router.post("/profile/skills", authMiddleware, addSkill);
router.delete("/profile/skills/:skillId", authMiddleware, deleteSkill);
router.post("/profile/projects", authMiddleware, addProject);
router.put("/profile/projects/:projectId", authMiddleware, updateProject);
router.delete("/profile/projects/:projectId", authMiddleware, deleteProject);

router.post(
  "/profile/upload-resume",
  authMiddleware,
  uploadResume,
  resumeUpload,
);
router.get("/profile/resume", authMiddleware, downloadResume);
router.delete("/profile/resume", authMiddleware, deleteResume);

module.exports = router;
