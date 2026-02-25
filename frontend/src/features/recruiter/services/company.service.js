import API from "../../../api/apiCheck";

export const companyService = {
  getMyCompany: async () => {
    const { data } = await API.get("/company/me");
    return data;
  },

  registerCompany: async (companyData) => {
    const { data } = await API.post("/company/register", companyData);
    return data;
  },

  updateCompany: async (companyId, updateData) => {
    const { data } = await API.put(`/company/update/${companyId}`, updateData);
    return data;
  },

  getCompanies: async (params) => {
    const { data } = await API.get("/company", { params });
    return data;
  },

  getJoinRequests: async () => {
    const { data } = await API.get("/company/requests");
    return data;
  },

  requestToJoinCompany: async (companyId) => {
    const { data } = await API.post(`/company/join/${companyId}`);
    return data;
  },

  respondToJoinRequest: async (recruiterId, status) => {
    const { data } = await API.post("/company/respond-request", {
      recruiterId,
      status,
    });
    return data;
  },

  leaveCompany: async () => {
    const { data } = await API.post("/company/leave");
    return data;
  },

  // Note: Admin routes usually involve verifying.
  verifyCompany: async (companyId, payload) => {
    const { data } = await API.put(`/company/verify/${companyId}`, payload);
    return data;
  },
};
