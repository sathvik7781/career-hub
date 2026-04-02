import { useState, createContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api/api";

export const AuthContext = createContext();

const INITIAL_USER = {
  token: null,
  id: null,
  email: null,
  role: null,
  isProfileComplete: false,
  profileImageUrl: null,
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    ...INITIAL_USER,
    token: localStorage.getItem("accessToken") || null,
  });
  const hasTriedRefresh = useRef(false);
  const navigate = useNavigate();

  // Keep Authorization header in sync with token
  useEffect(() => {
    if (user.token) {
      API.defaults.headers.common.Authorization = `Bearer ${user.token}`;
    } else {
      delete API.defaults.headers.common.Authorization;
    }
  }, [user.token]);

  const refreshSession = async () => {
    try {
      const res = await API.post("/auth/refresh-token");
      const { accessToken, user: userData } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      setUser({
        token: accessToken,
        id: userData.id,
        email: userData.email,
        role: userData.role ?? null,
        isProfileComplete: userData.isProfileComplete ?? false,
        profileImageUrl: userData.profileImageUrl ?? userData.basicInfo?.profileImageUrl ?? null,
      });
    } catch {
      localStorage.removeItem("accessToken");
      setUser(INITIAL_USER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasTriedRefresh.current) {
      hasTriedRefresh.current = true;
      refreshSession();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { accessToken, user: userData } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      setUser({
        token: accessToken,
        id: userData.id,
        email: userData.email,
        role: userData.role,
        isProfileComplete: userData.isProfileComplete,
        profileImageUrl: userData.basicInfo?.profileImageUrl ?? null,
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(INITIAL_USER);
      navigate("/login");
    }
  };

  const register = async (payload) => {
    try {
      const res = await API.post("/auth/register", payload);
      const { accessToken, user: userData } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      setUser({
        token: accessToken,
        id: userData.id,
        email: userData.email,
        role: userData.role,
        isProfileComplete: userData.isProfileComplete,
        profileImageUrl: userData.basicInfo?.profileImageUrl ?? null,
      });

      toast.success("Account created successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
      throw error;
    }
  };

  const updateProfileImage = (profileImageUrl) => {
    setUser((prev) => ({ ...prev, profileImageUrl }));
  };

  const updateProfileComplete = (isProfileComplete) => {
    setUser((prev) => ({ ...prev, isProfileComplete }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-app">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user.token,
        updateProfileImage,
        updateProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
