import API from "../../../api/apiCheck";

export const jobService = {
  postJob: async (data) => {
    const res = await API.post("/jobs", data);
    return res.data;
  },

  getJobs: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await API.get(`/jobs?${query}`);
    return res.data;
  },

  getJobById: async (id) => {
    const res = await API.get(`/jobs/${id}`);
    return res.data;
  },

  getMyJobs: async () => {
    const res = await API.get("/jobs/recruiter/me");
    return res.data;
  },

  updateJob: async (jobId, data) => {
    const res = await API.put(`/jobs/${jobId}`, data);
    return res.data;
  },

  deleteJob: async (jobId) => {
    const res = await API.delete(`/jobs/${jobId}`);
    return res.data;
  },
};
