import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import SeekerProfileView from "../components/SeekerProfileView";
import RecruiterProfileView from "../components/RecruiterProfileView";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  if (user.role === "recruiter") {
    return <RecruiterProfileView />;
  }

  return <SeekerProfileView />;
}
