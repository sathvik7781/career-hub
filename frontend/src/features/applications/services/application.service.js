import API from "../../../api/apiCheck";

export const applicationService = {
  applyToJob: async (data) => {
    const res = await API.post("/applications/apply", data);
    return res.data;
  },

  getMyApplications: async () => {
    const res = await API.get("/applications/me");
    return res.data;
  },

  getJobApplications: async (jobId) => {
    const res = await API.get(`/applications/job/${jobId}`);
    return res.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const res = await API.put(`/applications/status/${applicationId}`, {
      status,
    });
    return res.data;
  },
};
