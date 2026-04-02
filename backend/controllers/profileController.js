const profileService = require("../services/profileService");

exports.getMyProfile = async (req, res, next) => {
  try {
    const data = await profileService.getMyProfile(req.user.id, req.user.role);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ─── Basic Info ───────────────────────────────────────────────────────────────

exports.basicInfo = async (req, res, next) => {
  try {
    const profile = await profileService.updateBasicInfo(req.user.id, req.body.basicInfo);
    res.status(200).json({ success: true, message: "Basic info updated successfully", data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

exports.avatarUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    const profileImageUrl = await profileService.uploadAvatar(req.user.id, req.file.buffer);
    res.status(200).json({ success: true, message: "Profile image updated successfully", data: { profileImageUrl } });
  } catch (err) {
    next(err);
  }
};

exports.removeAvatar = async (req, res, next) => {
  try {
    await profileService.removeAvatar(req.user.id);
    res.status(200).json({ success: true, message: "Avatar removed successfully" });
  } catch (err) {
    next(err);
  }
};

// ─── Resume ───────────────────────────────────────────────────────────────────

exports.resumeUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const resumeUrl = await profileService.uploadResume(req.user.id, req.file);
    res.status(200).json({ success: true, message: "Resume uploaded successfully", data: { resumeUrl } });
  } catch (err) {
    next(err);
  }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const resumeUrl = await profileService.getResumeUrl(req.user.id);
    res.redirect(resumeUrl);
  } catch (err) {
    next(err);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    await profileService.deleteResume(req.user.id);
    res.status(200).json({ success: true, message: "Resume deleted" });
  } catch (err) {
    next(err);
  }
};

// ─── Education ────────────────────────────────────────────────────────────────

exports.addEducation = async (req, res, next) => {
  try {
    const profile = await profileService.addEducation(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Education added successfully", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const profile = await profileService.updateEducation(req.user.id, req.params.educationId, req.body);
    res.status(200).json({ success: true, message: "Education updated successfully", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const profile = await profileService.deleteEducation(req.user.id, req.params.educationId);
    res.status(200).json({ success: true, message: "Education deleted successfully", data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── Professional & Experience ────────────────────────────────────────────────

exports.updateProfessional = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfessional(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Professional section updated", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.addExperience = async (req, res, next) => {
  try {
    const profile = await profileService.addExperience(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Experience added", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const profile = await profileService.updateExperience(req.user.id, req.params.expId, req.body);
    res.status(200).json({ success: true, message: "Experience updated", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const profile = await profileService.deleteExperience(req.user.id, req.params.expId);
    res.status(200).json({ success: true, message: "Experience deleted", data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── Skills ───────────────────────────────────────────────────────────────────

exports.addSkill = async (req, res, next) => {
  try {
    const profile = await profileService.addSkill(req.user.id, req.body.name);
    res.status(200).json({ success: true, message: "Skill added", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const profile = await profileService.deleteSkill(req.user.id, req.params.skillId);
    res.status(200).json({ success: true, message: "Skill removed", data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── Projects ─────────────────────────────────────────────────────────────────

exports.addProject = async (req, res, next) => {
  try {
    const profile = await profileService.addProject(req.user.id, req.body);
    res.status(200).json({ success: true, message: "Project added", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const profile = await profileService.updateProject(req.user.id, req.params.projectId, req.body);
    res.status(200).json({ success: true, message: "Project updated", data: profile });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const profile = await profileService.deleteProject(req.user.id, req.params.projectId);
    res.status(200).json({ success: true, message: "Project deleted", data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── Saved Jobs ───────────────────────────────────────────────────────────────

exports.saveJob = async (req, res, next) => {
  try {
    const savedJobs = await profileService.saveJob(req.user.id, req.params.jobId);
    res.status(200).json({ success: true, message: "Job saved successfully", data: savedJobs });
  } catch (err) {
    next(err);
  }
};

exports.unsaveJob = async (req, res, next) => {
  try {
    const savedJobs = await profileService.unsaveJob(req.user.id, req.params.jobId);
    res.status(200).json({ success: true, message: "Job unsaved successfully", data: savedJobs });
  } catch (err) {
    next(err);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await profileService.getSavedJobs(req.user.id);
    res.status(200).json({ success: true, data: savedJobs });
  } catch (err) {
    next(err);
  }
};
