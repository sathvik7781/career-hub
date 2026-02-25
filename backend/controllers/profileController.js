const User = require("../models/user");
const SeekerProfile = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const {
  calculateSeekerProfileCompletion,
} = require("../utils/seekerProfileCompletion");

exports.getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  let profile = null;

  if (user.role === "seeker") {
    profile = await SeekerProfile.findOne({ user: user._id });

    if (!profile) {
      profile = await SeekerProfile.create({
        user: user._id,
        completion: {
          percentage: 0,
          completedSections: [],
        },
      });
    }
  } else if (user.role === "recruiter") {
    profile = await RecruiterProfile.findOne({ user: user._id });
  }

  res.json({
    role: user.role,
    isProfileComplete: user.isProfileComplete,
    profile,
  });
};

const { getGridFSBucket } = require("../utils/gridFs");

exports.basicInfo = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { basicInfo: req.body.basicInfo } },
      { new: true, upsert: true },
    );

    await updateProfileCompletion(profile);

    res.json({
      message: "Basic info updated successfully",
      profile,
      completion: profile.completion,
    });
  } catch (err) {
    console.log("BASIC INFO ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.avatarUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const bucket = getGridFSBucket();

    const existingProfile = await SeekerProfile.findOne({
      user: req.user.id,
    });

    const oldImageId = existingProfile?.basicInfo?.profileImageId;

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      try {
        const newFileId = uploadStream.id;

        const profile = await SeekerProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: { "basicInfo.profileImageId": newFileId } },
          { new: true, upsert: true },
        );

        if (oldImageId) {
          try {
            await bucket.delete(oldImageId);
          } catch (err) {
            console.log("Old avatar not found or already deleted");
          }
        }

        await updateProfileCompletion(profile);

        return res.json({
          message: "Profile image updated successfully",
          profileImageId: newFileId,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          message: "Failed to update profile image",
        });
      }
    });

    uploadStream.on("error", (err) => {
      console.error(err);
      return res.status(500).json({
        message: "Image upload failed",
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Avatar upload failed",
    });
  }
};
exports.removeAvatar = async (req, res) => {
  try {
    const bucket = getGridFSBucket();

    const profile = await SeekerProfile.findOne({
      user: req.user.id,
    });

    if (!profile || !profile.basicInfo?.profileImageId) {
      return res.status(400).json({ message: "No avatar to remove" });
    }

    const imageId = profile.basicInfo.profileImageId;

    await bucket.delete(imageId);

    profile.basicInfo.profileImageId = null;
    await profile.save();

    await updateProfileCompletion(profile);

    res.json({ message: "Avatar removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove avatar" });
  }
};

exports.addEducation = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    profile.education.push(req.body);

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({
      message: "Education added successfully",
      profile,
    });
  } catch (err) {
    console.log("ADD EDUCATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const education = profile.education.id(educationId);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    Object.assign(education, req.body);

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({
      message: "Education updated successfully",
      profile,
    });
  } catch (err) {
    console.log("UPDATE EDUCATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.education.pull(educationId);

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({
      message: "Education deleted successfully",
      profile,
    });
  } catch (err) {
    console.log("DELETE EDUCATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfessional = async (req, res) => {
  try {
    const { headline, careerLevel, summary, noExperience } = req.body;

    let updatedProfessional = {
      headline,
      careerLevel,
      summary,
      noExperience,
    };

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (careerLevel === "Fresher") {
      updatedProfessional.noExperience = true;
      profile.experience = [];
    }

    profile.professional = updatedProfessional;

    await profile.save();

    await updateProfileCompletion(profile);

    res.json({
      message: "Professional section updated",
      profile,
      completion: profile.completion,
    });
  } catch (err) {
    console.log("PROFESSIONAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id });

    if (
      profile.professional?.careerLevel === "Fresher" &&
      req.body.employmentType === "Full-time"
    ) {
      return res.status(400).json({
        message: "Freshers cannot add full-time experience",
      });
    }

    profile.experience.push(req.body);

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({ message: "Experience added", profile });
  } catch (err) {
    console.log("ADD EXPERIENCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { expId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    const exp = profile.experience.id(expId);

    if (!exp) {
      return res.status(404).json({ message: "Experience not found" });
    }

    Object.assign(exp, req.body);

    await profile.save();
    res.json({ message: "Experience updated", profile });
  } catch (err) {
    console.log("UPDATE EXPERIENCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { expId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    profile.experience.id(expId).deleteOne();

    await profile.save();

    res.json({ message: "Experience deleted", profile });
  } catch (err) {
    console.log("DELETE EXPERIENCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill name required" });
    }

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    const exists = profile.skills.some(
      (skill) => skill.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      return res.status(400).json({ message: "Skill already added" });
    }

    profile.skills.push({ name });

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({ message: "Skill added", profile });
  } catch (err) {
    console.log("ADD SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    profile.skills.id(skillId).deleteOne();

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({ message: "Skill removed", profile });
  } catch (err) {
    console.log("DELETE SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProject = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id });

    profile.projects.push(req.body);

    await profile.save();
    await updateProfileCompletion(profile);

    res.json({ message: "Project added", profile });
  } catch (err) {
    console.log("ADD PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    const project = profile.projects.id(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    Object.assign(project, req.body);

    await profile.save();

    res.json({ message: "Project updated", profile });
  } catch (err) {
    console.log("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const profile = await SeekerProfile.findOne({ user: req.user.id });

    profile.projects.id(projectId).deleteOne();

    await profile.save();

    res.json({ message: "Project deleted", profile });
  } catch (err) {
    console.log("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resumeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = getGridFSBucket();

    const existingProfile = await SeekerProfile.findOne({
      user: req.user.id,
    });

    const oldResumeId = existingProfile?.resumeFileId;

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      try {
        const newFileId = uploadStream.id;

        const profile = await SeekerProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: { resumeFileId: newFileId } },
          { new: true, upsert: true },
        );

        if (oldResumeId && oldResumeId.toString() !== newFileId.toString()) {
          await bucket.delete(oldResumeId);
        }

        await updateProfileCompletion(profile);

        return res.json({
          message: "Resume uploaded successfully",
          resumeFileId: newFileId,
        });
      } catch (err) {
        console.log("RESUME UPDATE ERROR:", err);
        return res.status(500).json({
          message: "Failed to update profile with resume",
        });
      }
    });

    uploadStream.on("error", (err) => {
      console.log("UPLOAD ERROR:", err);
      return res.status(500).json({
        message: "Upload failed in MongoDB Atlas",
      });
    });
  } catch (err) {
    console.log("RESUME UPLOAD ERROR:", err);
    return res.status(500).json({
      message: "Upload failed",
    });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id });

    if (!profile?.resumeFileId) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const bucket = getGridFSBucket();

    const downloadStream = bucket.openDownloadStream(profile.resumeFileId);

    res.set("Content-Type", "application/pdf");

    downloadStream.pipe(res);
  } catch (err) {
    console.log("DOWNLOAD RESUME ERROR:", err);
    res.status(500).json({ message: "Failed to download resume" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id });

    if (!profile?.resumeFileId) {
      return res.status(404).json({ message: "No resume to delete" });
    }

    const bucket = getGridFSBucket();

    await bucket.delete(profile.resumeFileId);

    profile.resumeFileId = null;
    await profile.save();

    await updateProfileCompletion(profile);

    res.json({ message: "Resume deleted" });
  } catch (err) {
    console.log("DELETE RESUME ERROR:", err);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

const updateProfileCompletion = async (profile) => {
  const completion = calculateSeekerProfileCompletion(profile);

  await SeekerProfile.findByIdAndUpdate(profile._id, {
    completion,
  });

  await User.findByIdAndUpdate(profile.user, {
    isProfileComplete: completion.percentage === 100,
  });

  profile.completion = completion;
};
