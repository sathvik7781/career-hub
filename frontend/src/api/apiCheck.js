import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/refresh-token",
];

API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url.includes(route),
    );

    const hasAccessToken = !!localStorage.getItem("accessToken");

    if (error.response.status === 401 && hasAccessToken && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/auth/refresh-token");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
