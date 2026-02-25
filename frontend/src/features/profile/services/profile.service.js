import API from "../../../api/apiCheck";

export const profileService = {
  getProfile: async () => {
    const { data } = await API.get("/profile/me");
    return data;
  },

  // Future methods (e.g., updateProfile) can go here
};
