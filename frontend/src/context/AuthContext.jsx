import { useState, createContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api/apiCheck";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const hasTriedRefresh = useRef(false);

  const [user, setUser] = useState({
    token: localStorage.getItem("accessToken") || null,
    id: null,
    role: null,
    isProfileComplete: false,
  });

  const navigate = useNavigate();

  // Attach token safely
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

      setUser({
        token: res.data.accessToken,
        id: res.data.user.id,
        role: res.data.user.role ?? null,
        isProfileComplete: res.data.user.isProfileComplete ?? false,
      });
    } catch (error) {
      setUser({
        token: null,
        id: null,
        role: null,
        isProfileComplete: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Try refresh ONCE on app load
  useEffect(() => {
    if (!hasTriedRefresh.current) {
      hasTriedRefresh.current = true;
      refreshSession();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("accessToken", res.data.token);
      setUser({
        token: res.data.token,
        id: res.data.id,
        role: res.data.role,
        isProfileComplete: res.data.isProfileComplete,
      });

      toast.success("Login successful!");
      navigate(res.data.isProfileComplete ? "/" : "/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const logout = async () => {
    await API.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser({
      token: null,
      id: null,
      role: null,
      isProfileComplete: false,
    });
    navigate("/login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
