import API from "../api/apiCheck";

export const authService = {
  // Register flow
  requestRegisterOtp: async (email) => {
    const response = await API.post("/auth/register/request-otp", { email });
    return response.data;
  },

  verifyRegisterOtp: async (email, otp) => {
    const response = await API.post("/auth/register/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  register: async (payload) => {
    const response = await API.post("/auth/register", payload);
    return response.data;
  },

  // Forgot password flow
  requestForgotOtp: async (email) => {
    const response = await API.post("/auth/forgot-password/request-otp", {
      email,
    });
    return response.data;
  },

  verifyForgotOtp: async (email, otp) => {
    const response = await API.post("/auth/forgot-password/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (email, newPassword) => {
    const response = await API.post("/auth/forgot-password/reset", {
      email,
      newPassword,
    });
    return response.data;
  },
};
