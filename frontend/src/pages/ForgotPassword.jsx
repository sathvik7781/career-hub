import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const FP_KEY = "careerhub_forgot_password_progress";

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------- PASSWORD RULES ---------- */
  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  /* ---------- RESTORE STATE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(FP_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.email) {
        setFormData((prev) => ({ ...prev, email: parsed.email }));
      }

      if (parsed.step) {
        setStep(parsed.step);
      }

      if (parsed.otpSentAt) {
        const elapsed = Math.floor((Date.now() - parsed.otpSentAt) / 1000);
        const remaining = 60 - elapsed;
        if (remaining > 0) setResendCooldown(remaining);
      }
    } catch {
      localStorage.removeItem(FP_KEY);
    }
  }, []);

  /* ---------- PERSIST STATE ---------- */
  useEffect(() => {
    localStorage.setItem(
      FP_KEY,
      JSON.stringify({
        step,
        email: formData.email,
        otpSentAt: step === "otp" ? Date.now() : undefined,
      }),
    );
  }, [step, formData.email]);

  /* ---------- RESEND COOLDOWN ---------- */
  useEffect(() => {
    if (resendCooldown <= 0) return;

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

  /* ---------- STEP 1: SEND OTP ---------- */
  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email address is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/forgot-password/request-otp`, {
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

  /* ---------- STEP 2: VERIFY OTP ---------- */
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Session expired. Please restart the process.");
      setStep("email");
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/forgot-password/verify-otp`, {
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      toast.success("OTP verified");
      setStep("password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- STEP 2: RESEND OTP ---------- */
  async function handleResendOtp() {
    setError("");
    setFormData((prev) => ({ ...prev, otp: "" }));

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/forgot-password/request-otp`, {
        email: formData.email,
      });

      toast.success("OTP resent");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- STEP 3: RESET PASSWORD ---------- */
  async function handleResetPassword() {
    setError("");

    if (!formData.email) {
      setError("Session expired. Please restart the process.");
      setStep("email");
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

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/forgot-password/reset`, {
        email: formData.email,
        newPassword: formData.password,
      });

      toast.success("Password reset successful");
      localStorage.removeItem(FP_KEY);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-secondary px-[1.5rem]">
      <div className="w-full max-w-[28rem] animate-slideUp bg-white rounded-[1rem] px-[2rem] py-[2rem] shadow">
        <h1 className="text-[1.5rem] font-semibold mb-[0.5rem]">
          Reset your password
        </h1>

        {/* STEP 1 */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-[1rem]">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem]">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-[1rem]">
            <input
              type="text"
              name="otp"
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  otp: e.target.value.replace(/\D/g, ""),
                }))
              }
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem]">
              Verify OTP
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0}
              className="w-full border border-primary text-primary py-[0.65rem] rounded-[0.5rem] disabled:opacity-60"
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === "password" && (
          <div className="space-y-[1rem]">
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
            />

            <div className="text-[0.75rem] space-y-[0.25rem]">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleResetPassword}
              className="w-full bg-primary text-white py-[0.65rem] rounded-[0.5rem]"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- PASSWORD RULE ---------- */
function PasswordRule({ ok, label }) {
  return <p className={ok ? "text-green-600" : "text-gray-500"}>{label}</p>;
}
