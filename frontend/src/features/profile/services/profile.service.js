import API from "../../../api/api";

export const profileService = {
  getProfile: async () => {
    const res = await API.get("/profile/me");
    return res.data.data;
  },

  updateBasicInfo: async (basicInfo) => {
    const res = await API.post("/profile/basic-info", { basicInfo });
    return res.data.data;
  },

  // Education
  addEducation: async (data) => { const res = await API.post("/profile/education", data); return res.data.data; },
  updateEducation: async ({ id, data }) => { const res = await API.put(`/profile/education/${id}`, data); return res.data.data; },
  deleteEducation: async (id) => { await API.delete(`/profile/education/${id}`); },

  // Professional
  updateProfessional: async (data) => { const res = await API.put("/profile/professional", data); return res.data.data; },
  addExperience: async (data) => { const res = await API.post("/profile/experience", data); return res.data.data; },
  updateExperience: async ({ id, data }) => { const res = await API.put(`/profile/experience/${id}`, data); return res.data.data; },
  deleteExperience: async (id) => { await API.delete(`/profile/experience/${id}`); },

  // Skills & Projects
  addSkill: async (name) => { const res = await API.post("/profile/skills", { name }); return res.data.data; },
  deleteSkill: async (id) => { await API.delete(`/profile/skills/${id}`); },
  addProject: async (data) => { const res = await API.post("/profile/projects", data); return res.data.data; },
  updateProject: async ({ id, data }) => { const res = await API.put(`/profile/projects/${id}`, data); return res.data.data; },
  deleteProject: async (id) => { await API.delete(`/profile/projects/${id}`); },

  // Resume & Avatar
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await API.post("/profile/upload-resume", formData);
    return res.data.data;
  },
  deleteResume: async () => { await API.delete("/profile/resume"); },
  removeAvatar: async () => { await API.delete("/profile/remove-avatar"); },

  // Saved Jobs
  getSavedJobs: async () => { const res = await API.get("/profile/saved-jobs"); return res.data.data; },
  saveJob: async (jobId) => { const res = await API.post(`/profile/saved-jobs/${jobId}`); return res.data.data; },
  unsaveJob: async (jobId) => { const res = await API.delete(`/profile/saved-jobs/${jobId}`); return res.data.data; },
};
