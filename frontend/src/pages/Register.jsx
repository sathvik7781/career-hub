import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import registerImage from "../assets/images/registerImage.png";

export default function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    userOtp: "",
    password: "",
    role: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email address is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/request-otp`, {
        email: formData.email,
      });

      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");

    if (!formData.userOtp) {
      setError("Please enter the verification code");
      return;
    }

    setStep("role");
  }

  async function handleRegister() {
    setError("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (!formData.role) {
      setError("Please select how you want to use Career Hub");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/register`, formData);

      localStorage.setItem("token", res.data.token);
      toast.success("Account created successfully");

      navigate("/complete-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-primary">
        <img
          src={registerImage}
          alt="Career Hub"
          className="max-w-[80%] animate-fadeIn"
        />
      </div>

      <div className="flex items-center justify-center bg-secondary px-[1.5rem]">
        <div className="w-full max-w-[28rem] animate-slideUp bg-white rounded-[1rem] px-[2rem] py-[2rem] border border-[rgba(0,0,0,0.06)] shadow-[0_0.75rem_2rem_rgba(0,0,0,0.08)] relative">
          <h1 className="text-[1.5rem] font-semibold mb-[0.25rem]">
            Create your Career Hub account
          </h1>

          <p className="text-gray-500 mb-[1.5rem] text-[0.875rem]">
            Connecting talent with opportunity
          </p>

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-[1rem]">
              <div>
                <label className="block text-[0.875rem] mb-[0.25rem]">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && <p className="text-red-500 text-[0.875rem]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-[0.5rem] rounded-[0.5rem] disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Generate OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-[1rem]">
              <div>
                <label className="block text-[0.875rem] mb-[0.25rem]">
                  Email address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-[0.875rem] mb-[0.25rem]">
                  Verification code
                </label>
                <input
                  type="text"
                  name="userOtp"
                  placeholder="Enter 6-digit code"
                  value={formData.userOtp}
                  onChange={handleChange}
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
                />
                <p className="text-gray-500 text-[0.75rem] mt-[0.25rem]">
                  Enter the code sent to your email
                </p>
              </div>

              {error && <p className="text-red-500 text-[0.875rem]">{error}</p>}

              <button
                type="submit"
                className="w-full bg-primary text-white py-[0.5rem] rounded-[0.5rem]"
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3: PASSWORD + ROLE */}
          {step === "role" && (
            <div className="space-y-[1.25rem]">
              <div>
                <label className="block text-[0.875rem] mb-[0.25rem]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
                />
              </div>

              <div>
                <p className="text-[0.875rem] mb-[0.5rem]">I want to</p>
                <div className="grid grid-cols-2 gap-[1rem]">
                  <RoleCard
                    title="Find Jobs"
                    subtitle="Job Seeker"
                    selected={formData.role === "seeker"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "seeker",
                      }))
                    }
                  />
                  <RoleCard
                    title="Hire Talent"
                    subtitle="Recruiter"
                    selected={formData.role === "recruiter"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "recruiter",
                      }))
                    }
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-[0.875rem]">{error}</p>}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-primary text-white py-[0.5rem] rounded-[0.5rem] disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ROLE CARD ---------------- */
function RoleCard({ title, subtitle, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-[0.75rem] p-[1rem] text-center transition
        ${
          selected
            ? "border-primary bg-blue-50"
            : "border-gray-200 hover:border-primary"
        }`}
    >
      <p className="font-medium">{title}</p>
      <p className="text-gray-500 text-[0.875rem]">{subtitle}</p>
    </div>
  );
}
