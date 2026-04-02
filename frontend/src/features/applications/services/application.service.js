import API from "../../../api/api";

export const applicationService = {
  applyToJob: async (data) => {
    const res = await API.post("/applications/apply", data);
    return res.data.data;
  },

  getMyApplications: async () => {
    const res = await API.get("/applications/me");
    return res.data.data;
  },

  getJobApplications: async (jobId) => {
    const res = await API.get(`/applications/job/${jobId}`);
    return res.data.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const res = await API.put(`/applications/status/${applicationId}`, {
      status,
    });
    return res.data.data;
  },
};
