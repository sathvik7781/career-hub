const User = require("../models/User");
const SeekerProfile = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");

function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  return String(skills)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin profile is not required" });
    }

    if (user.role === "seeker") {
      const {
        fullName,
        phone,
        education,
        experience,
        skills,
        resumeUrl,
        profileImageUrl,
      } = req.body;

      if (!fullName || !phone || !education || !experience) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const payload = {
        user: user._id,
        fullName,
        phone,
        education,
        experience,
        skills: normalizeSkills(skills),
        resumeUrl,
        profileImageUrl,
      };

      const profile = await SeekerProfile.findOneAndUpdate(
        { user: user._id },
        payload,
        { new: true, upsert: true },
      );

      user.profileRef = profile._id;
      user.roleProfile = "SeekerProfile";
      user.isProfileComplete = true;
      await user.save();

      return res.status(200).json({
        message: "Profile completed successfully",
        profile,
      });
    }

    if (user.role === "recruiter") {
      const { companyName, location, designation, companyWebsite, companyEmail } =
        req.body;

      if (!companyName || !location || !designation) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const payload = {
        user: user._id,
        companyName,
        location,
        designation,
        companyWebsite,
        companyEmail,
      };

      const profile = await RecruiterProfile.findOneAndUpdate(
        { user: user._id },
        payload,
        { new: true, upsert: true },
      );

      user.profileRef = profile._id;
      user.roleProfile = "RecruiterProfile";
      user.isProfileComplete = true;
      await user.save();

      return res.status(200).json({
        message: "Profile completed successfully",
        profile,
      });
    }

    return res.status(400).json({ message: "Unsupported role" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;
    if (user.role === "seeker") {
      profile = await SeekerProfile.findOne({ user: user._id });
    }
    if (user.role === "recruiter") {
      profile = await RecruiterProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
      profile,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
