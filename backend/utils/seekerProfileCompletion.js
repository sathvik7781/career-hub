// utils/seekerProfileCompletion.js

const SECTION_WEIGHTS = {
  basicInfo: 25,
  professional: 10,
  education: 20,
  experience: 15,
  skills: 20,
  resume: 10,
};

const calculateSeekerProfileCompletion = (profile) => {
  let percentage = 0;
  const completedSections = [];

  if (
    profile.basicInfo &&
    profile.basicInfo.firstName &&
    profile.basicInfo.phone &&
    profile.basicInfo.city &&
    profile.basicInfo.country
  ) {
    percentage += SECTION_WEIGHTS.basicInfo;
    completedSections.push("basic");
  }

  if (
    profile.professional &&
    profile.professional.headline?.trim() &&
    profile.professional.summary?.trim()
  ) {
    percentage += SECTION_WEIGHTS.professional;
    completedSections.push("professional");
  }

  if (profile.education && profile.education.length > 0) {
    percentage += SECTION_WEIGHTS.education;
    completedSections.push("education");
  }

  if (
    profile.professional?.noExperience === true ||
    (profile.experience && profile.experience.length > 0)
  ) {
    percentage += SECTION_WEIGHTS.experience;
    completedSections.push("experience");
  }

  if (profile.skills?.length > 0 || profile.projects?.length > 0) {
    percentage += SECTION_WEIGHTS.skills;
    completedSections.push("skills");
  }

  if (profile.resumeUrl) {
    percentage += SECTION_WEIGHTS.resume;
    completedSections.push("resume");
  }

  return {
    percentage,
    completedSections,
  };
};

module.exports = { calculateSeekerProfileCompletion };
