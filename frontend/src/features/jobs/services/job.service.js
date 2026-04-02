import API from "../../../api/api";

export const jobService = {
  postJob: async (data) => {
    const res = await API.post("/jobs", data);
    return res.data.data;
  },

  getJobs: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v != null))
    ).toString();
    const res = await API.get(`/jobs?${query}`);
    // Return full response including pagination metadata
    return { data: res.data.data, pagination: res.data.pagination };
  },

  getJobById: async (id) => {
    const res = await API.get(`/jobs/${id}`);
    return res.data.data;
  },

  getMyJobs: async () => {
    const res = await API.get("/jobs/recruiter/me");
    return res.data.data;
  },

  updateJob: async (jobId, data) => {
    const res = await API.put(`/jobs/${jobId}`, data);
    return res.data.data;
  },

  deleteJob: async (jobId) => {
    const res = await API.delete(`/jobs/${jobId}`);
    return res.data.data;
  },
};
