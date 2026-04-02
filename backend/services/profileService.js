const SeekerProfile = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { calculateSeekerProfileCompletion } = require("../utils/seekerProfileCompletion");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// ─── Profile Completion ───────────────────────────────────────────────────────

const updateProfileCompletion = async (profile) => {
  const completion = calculateSeekerProfileCompletion(profile);
  await SeekerProfile.findByIdAndUpdate(profile._id, { completion });
  await User.findByIdAndUpdate(profile.user, {
    isProfileComplete: completion.percentage === 100,
  });
  profile.completion = completion;
};

// ─── Get Profile ──────────────────────────────────────────────────────────────

exports.getMyProfile = async (userId, role) => {
  let profile = null;

  if (role === "seeker") {
    profile = await SeekerProfile.findOne({ user: userId });
    if (!profile) {
      profile = await SeekerProfile.create({
        user: userId,
        completion: { percentage: 0, completedSections: [] },
      });
    }
  } else if (role === "recruiter") {
    profile = await RecruiterProfile.findOne({ user: userId }).populate("company");
  }

  const user = await User.findById(userId).select("isProfileComplete role");

  return {
    role: user.role,
    isProfileComplete: user.isProfileComplete,
    profile,
  };
};

// ─── Basic Info ───────────────────────────────────────────────────────────────

exports.updateBasicInfo = async (userId, basicInfo) => {
  const profile = await SeekerProfile.findOneAndUpdate(
    { user: userId },
    { $set: { basicInfo } },
    { new: true, upsert: true },
  );
  await updateProfileCompletion(profile);
  return profile;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

exports.uploadAvatar = async (userId, fileBuffer) => {
  const result = await uploadToCloudinary(fileBuffer, {
    folder: "careerhub/avatars",
    resource_type: "image",
    transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
  });

  const existing = await SeekerProfile.findOne({ user: userId }).select(
    "basicInfo.profileImagePublicId",
  );
  const oldPublicId = existing?.basicInfo?.profileImagePublicId;

  const updated = await SeekerProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        "basicInfo.profileImageUrl": result.secure_url,
        "basicInfo.profileImagePublicId": result.public_id,
      },
    },
    { new: true, upsert: true },
  );

  if (oldPublicId) deleteFromCloudinary(oldPublicId, "image");

  await updateProfileCompletion(updated);
  return result.secure_url;
};

exports.removeAvatar = async (userId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile?.basicInfo?.profileImagePublicId) {
    throw new AppError("No avatar to remove", 400);
  }

  await deleteFromCloudinary(profile.basicInfo.profileImagePublicId, "image");
  profile.basicInfo.profileImageUrl = null;
  profile.basicInfo.profileImagePublicId = null;
  await profile.save();
  await updateProfileCompletion(profile);
};

// ─── Resume ───────────────────────────────────────────────────────────────────

exports.uploadResume = async (userId, file) => {
  const result = await uploadToCloudinary(file.buffer, {
    folder: "careerhub/resumes",
    resource_type: "raw",
    public_id: `resume_${userId}`,
    overwrite: true,
  });

  const existing = await SeekerProfile.findOne({ user: userId }).select("resumePublicId");
  const oldPublicId = existing?.resumePublicId;

  const updated = await SeekerProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        resumeUrl: result.secure_url,
        resumePublicId: result.public_id,
        resumeOriginalName: file.originalname,
      },
    },
    { new: true, upsert: true },
  );

  if (oldPublicId && oldPublicId !== result.public_id) {
    deleteFromCloudinary(oldPublicId, "raw");
  }

  await updateProfileCompletion(updated);
  return result.secure_url;
};

exports.getResumeUrl = async (userId) => {
  const profile = await SeekerProfile.findOne({ user: userId }).select("resumeUrl");
  if (!profile?.resumeUrl) throw new AppError("No resume found", 404);
  return profile.resumeUrl;
};

exports.deleteResume = async (userId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile?.resumeUrl) throw new AppError("No resume to delete", 404);

  await deleteFromCloudinary(profile.resumePublicId, "raw");
  profile.resumeUrl = null;
  profile.resumePublicId = null;
  profile.resumeOriginalName = null;
  await profile.save();
  await updateProfileCompletion(profile);
};

// ─── Education ────────────────────────────────────────────────────────────────

exports.addEducation = async (userId, educationData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  profile.education.push(educationData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.updateEducation = async (userId, educationId, educationData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const education = profile.education.id(educationId);
  if (!education) throw new AppError("Education not found", 404);
  Object.assign(education, educationData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.deleteEducation = async (userId, educationId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  profile.education.pull(educationId);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

// ─── Professional & Experience ────────────────────────────────────────────────

exports.updateProfessional = async (userId, profData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  if (profData.careerLevel === "Fresher") {
    profData.noExperience = true;
    profile.experience = [];
  }
  profile.professional = profData;
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.addExperience = async (userId, expData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  if (profile.professional?.careerLevel === "Fresher" && expData.employmentType === "Full-time") {
    throw new AppError("Freshers cannot add full-time experience", 400);
  }
  profile.experience.push(expData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.updateExperience = async (userId, expId, expData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const exp = profile.experience.id(expId);
  if (!exp) throw new AppError("Experience not found", 404);
  Object.assign(exp, expData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.deleteExperience = async (userId, expId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const exp = profile.experience.id(expId);
  if (exp) {
    exp.deleteOne();
    await profile.save();
    await updateProfileCompletion(profile);
  }
  return profile;
};

// ─── Skills ───────────────────────────────────────────────────────────────────

exports.addSkill = async (userId, name) => {
  if (!name) throw new AppError("Skill name required", 400);
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const exists = profile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase());
  if (exists) throw new AppError("Skill already added", 400);
  profile.skills.push({ name });
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.deleteSkill = async (userId, skillId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const skill = profile.skills.id(skillId);
  if (skill) {
    skill.deleteOne();
    await profile.save();
    await updateProfileCompletion(profile);
  }
  return profile;
};

// ─── Projects ─────────────────────────────────────────────────────────────────

exports.addProject = async (userId, projectData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  profile.projects.push(projectData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.updateProject = async (userId, projectId, projectData) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const project = profile.projects.id(projectId);
  if (!project) throw new AppError("Project not found", 404);
  Object.assign(project, projectData);
  await profile.save();
  await updateProfileCompletion(profile);
  return profile;
};

exports.deleteProject = async (userId, projectId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  const project = profile.projects.id(projectId);
  if (project) {
    project.deleteOne();
    await profile.save();
    await updateProfileCompletion(profile);
  }
  return profile;
};

// ─── Saved Jobs ───────────────────────────────────────────────────────────────

exports.saveJob = async (userId, jobId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  
  if (!profile.savedJobs.includes(jobId)) {
    profile.savedJobs.push(jobId);
    await profile.save();
  }
  return profile;
};

exports.unsaveJob = async (userId, jobId) => {
  const profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) throw new AppError("Profile not found", 404);
  
  profile.savedJobs = profile.savedJobs.filter(id => id.toString() !== jobId.toString());
  await profile.save();
  return profile;
};

exports.getSavedJobs = async (userId) => {
  const profile = await SeekerProfile.findOne({ user: userId })
    .populate({
      path: "savedJobs",
      match: { isDeleted: false },
      populate: { path: "company", select: "name logo location" }
    });
  if (!profile) throw new AppError("Profile not found", 404);
  
  // Filter out any jobs that might be null
  return profile.savedJobs.filter(job => job !== null);
};
