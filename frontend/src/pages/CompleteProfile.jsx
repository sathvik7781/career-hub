import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function decodeToken(token) {
  try {
    const payloadPart = token.split(".")[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export default function CompleteProfile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const payload = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const role = payload?.role;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [seekerForm, setSeekerForm] = useState({
    fullName: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    resumeUrl: "",
    profileImageUrl: "",
  });

  const [recruiterForm, setRecruiterForm] = useState({
    companyName: "",
    location: "",
    designation: "",
    companyWebsite: "",
    companyEmail: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  function handleSeekerChange(e) {
    setSeekerForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleRecruiterChange(e) {
    setRecruiterForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!role || role === "admin") {
      setError("Invalid role for profile completion");
      return;
    }

    const payloadData = role === "seeker" ? seekerForm : recruiterForm;

    try {
      setLoading(true);

      await axios.post(`${API_URL}/profile/complete`, payloadData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile completed successfully");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  }

  if (!role) {
    return null;
  }

  if (role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Admin profile is not required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-[1.5rem] py-[2rem]">
      <div className="w-full max-w-[36rem] bg-white rounded-[1rem] px-[1.5rem] sm:px-[2rem] py-[1.5rem] sm:py-[2rem] border border-[rgba(0,0,0,0.06)] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h1 className="text-[1.5rem] font-semibold mb-[0.25rem] tracking-tight">
          Complete your profile
        </h1>
        <p className="text-gray-500 mb-[1.5rem] text-[0.875rem]">
          Help us personalize your Career Hub experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          {role === "seeker" && (
            <>
              <Input
                label="Full name"
                name="fullName"
                value={seekerForm.fullName}
                onChange={handleSeekerChange}
                placeholder="Your full name"
              />
              <Input
                label="Phone number"
                name="phone"
                value={seekerForm.phone}
                onChange={handleSeekerChange}
                placeholder="Your phone number"
              />
              <Input
                label="Education"
                name="education"
                value={seekerForm.education}
                onChange={handleSeekerChange}
                placeholder="Highest qualification"
              />
              <Input
                label="Professional experience"
                name="experience"
                value={seekerForm.experience}
                onChange={handleSeekerChange}
                placeholder="e.g., 2 years in frontend development"
              />
              <Input
                label="Skills"
                name="skills"
                value={seekerForm.skills}
                onChange={handleSeekerChange}
                placeholder="Comma-separated skills"
              />
              <Input
                label="Resume URL"
                name="resumeUrl"
                value={seekerForm.resumeUrl}
                onChange={handleSeekerChange}
                placeholder="Link to your resume"
              />
              <Input
                label="Profile image URL"
                name="profileImageUrl"
                value={seekerForm.profileImageUrl}
                onChange={handleSeekerChange}
                placeholder="Link to your profile picture"
              />
            </>
          )}

          {role === "recruiter" && (
            <>
              <Input
                label="Company name"
                name="companyName"
                value={recruiterForm.companyName}
                onChange={handleRecruiterChange}
                placeholder="Your company"
              />
              <Input
                label="Location"
                name="location"
                value={recruiterForm.location}
                onChange={handleRecruiterChange}
                placeholder="City, Country"
              />
              <Input
                label="Designation"
                name="designation"
                value={recruiterForm.designation}
                onChange={handleRecruiterChange}
                placeholder="Your role"
              />
              <Input
                label="Company website"
                name="companyWebsite"
                value={recruiterForm.companyWebsite}
                onChange={handleRecruiterChange}
                placeholder="https://example.com"
              />
              <Input
                label="Company email"
                name="companyEmail"
                value={recruiterForm.companyEmail}
                onChange={handleRecruiterChange}
                placeholder="contact@company.com"
              />
            </>
          )}

          {error && (
            <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[0.875rem] mb-[0.25rem]">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>
  );
}
