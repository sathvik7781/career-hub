import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
