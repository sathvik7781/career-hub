import React, { useEffect, useState } from "react";
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
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    userOtp: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

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
      setResendCooldown(60);
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
    toast.success("OTP verified");
  }

  async function handleResendOtp() {
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

      toast.success("OTP resent to your email");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (!passwordIsValid) {
      setError(
        "Password must be at least 8 characters and include upper, lower, number, and special character",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.role) {
      setError("Please select how you want to use Career Hub");
      return;
    }

    const { confirmPassword, ...payload } = formData;

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/register`, payload);

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
        <div
          className="w-full max-w-[28rem] animate-slideUp bg-white rounded-[1rem] px-[1.5rem] sm:px-[2rem] py-[1.5rem] sm:py-[2rem] 
                     border border-[rgba(0,0,0,0.06)] 
                     shadow-[0_10px_30px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,96,196,0.08)] 
                     hover:shadow-[0_14px_40px_rgba(0,0,0,0.15),0_0_0_2px_rgba(0,96,196,0.15)]
                     transition-shadow duration-300 relative"
        >
          <h1 className="text-[1.5rem] font-semibold mb-[0.25rem] tracking-tight">
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
                {loading ? "Sending OTP..." : "Generate OTP"}
              </button>
              <p className="text-center mt-[0.5rem]">
                Have an account?
                <a
                  onClick={() => navigate("/login")}
                  className="text-primary font-medium px-[0.25rem] cursor-pointer hover:underline"
                >
                  Sign in
                </a>
              </p>
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
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter 6-digit code"
                  value={formData.userOtp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userOtp: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
"
                />
                <p className="text-gray-500 text-[0.75rem] mt-[0.25rem]">
                  Enter the code sent to your email
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem]"
              >
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className="w-full border border-primary text-primary py-[0.65rem] rounded-[0.5rem] disabled:opacity-60"
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
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
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
"
                />
                <div className="mt-[0.5rem] space-y-[0.25rem] text-[0.75rem]">
                  <PasswordRule
                    ok={passwordRules.length}
                    label="At least 8 characters"
                  />
                  <PasswordRule
                    ok={passwordRules.uppercase}
                    label="One uppercase letter"
                  />
                  <PasswordRule
                    ok={passwordRules.lowercase}
                    label="One lowercase letter"
                  />
                  <PasswordRule ok={passwordRules.number} label="One number" />
                  <PasswordRule
                    ok={passwordRules.special}
                    label="One special character"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.875rem] mb-[0.25rem]">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
"
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

              {error && (
                <p className="text-red-500 text-[0.875rem] mt-[0.25rem]">
                  {error}
                </p>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem] disabled:opacity-60"
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
            ? "border-primary bg-blue-50 ring-2 ring-primary/30"
            : "border-gray-200 hover:border-primary"
        }`}
    >
      <p className="font-medium">{title}</p>
      <p className="text-gray-500 text-[0.875rem]">{subtitle}</p>
    </div>
  );
}

/* ---------------- PASSWORD RULE ---------------- */
function PasswordRule({ ok, label }) {
  return (
    <p className={ok ? "text-green-600" : "text-gray-500"}>{label}</p>
  );
}
