import API from "../../../api/api";

export const companyService = {
  getMyCompany: async () => {
    const res = await API.get("/company/me");
    return res.data.data;
  },

  registerCompany: async (companyData) => {
    const res = await API.post("/company/register", companyData);
    return res.data.data;
  },

  updateCompany: async (companyId, updateData) => {
    const res = await API.put(`/company/update/${companyId}`, updateData);
    return res.data.data;
  },

  getCompanyById: async (companyId) => {
    const res = await API.get(`/company/${companyId}`);
    return res.data.data;
  },

  getCompanies: async (params) => {
    const res = await API.get("/company", { params });
    return res.data.data;
  },

  getAdminCompanies: async (params) => {
    const res = await API.get("/company/admin/all", { params });
    return res.data.data;
  },

  getJoinRequests: async () => {
    const res = await API.get("/company/requests");
    return res.data.data;
  },

  requestToJoinCompany: async (companyId) => {
    const res = await API.post(`/company/join/${companyId}`);
    return res.data.data;
  },

  respondToJoinRequest: async (recruiterId, status) => {
    const res = await API.post("/company/respond-request", {
      recruiterId,
      status,
    });
    return res.data.data;
  },

  leaveCompany: async () => {
    const res = await API.post("/company/leave");
    return res.data.data;
  },

  verifyCompany: async (companyId, payload) => {
    const res = await API.put(`/company/verify/${companyId}`, payload);
    return res.data.data;
  },
};
