import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import toast from "react-hot-toast";
import GradientMesh from "../components/GradientMesh";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Briefcase,
  Building2,
  ShieldCheck,
  Users,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  Bell,
  Globe,
} from "lucide-react";

const REG_KEY = "careerhub_register_progress";
const STEP_INDEX = { email: 0, otp: 1, role: 2 };
const STEPS = ["Email", "Verify", "Account"];

const PASSWORD_RULES = [
  { key: "length", label: "8+ characters", test: (p) => p.length >= 8 },
  { key: "uppercase", label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lowercase", label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number", test: (p) => /\d/.test(p) },
  {
    key: "special",
    label: "Special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const LEFT_FEATURES = [
  {
    icon: ShieldCheck,
    title: "OTP Verified",
    desc: "Every account is email-verified before access",
  },
  {
    icon: Building2,
    title: "Trusted Companies",
    desc: "Only admin-approved employers on the platform",
  },
  {
    icon: Users,
    title: "Active Community",
    desc: "Join 2M+ professionals already on CareerHub",
  },
  {
    icon: TrendingUp,
    title: "Career Insights",
    desc: "Data-driven salary and role trend reports",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    desc: "Get notified the moment your dream job posts",
  },
  {
    icon: Globe,
    title: "Remote Ready",
    desc: "Filter for remote, hybrid, or on-site roles",
  },
];

export default function Register() {
  const { register } = useContext(AuthContext);

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    userOtp: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const passwordChecks = PASSWORD_RULES.map((r) => ({
    ...r,
    ok: r.test(formData.password),
  }));
  const passwordIsValid = passwordChecks.every((r) => r.ok);

  useEffect(() => {
    const saved = localStorage.getItem(REG_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.email) return;
      setFormData((prev) => ({ ...prev, email: parsed.email }));
      if (parsed.step === "otp" || parsed.step === "role") setStep(parsed.step);
      if (parsed.otpSentAt) {
        const remaining =
          60 - Math.floor((Date.now() - parsed.otpSentAt) / 1000);
        if (remaining > 0) setResendCooldown(remaining);
      }
    } catch {
      localStorage.removeItem(REG_KEY);
    }
  }, []);

  const [otpSentAt, setOtpSentAt] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      REG_KEY,
      JSON.stringify({
        step,
        email: formData.email,
        otpSentAt,
      }),
    );
  }, [step, formData.email, otpSentAt]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email) {
      setError("Email address is required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register/request-otp", { email: formData.email });
      toast.success("Verification code sent!");
      setStep("otp");
      const sentAt = Date.now();
      setOtpSentAt(sentAt);
      setResendCooldown(60);
      localStorage.setItem(
        REG_KEY,
        JSON.stringify({
          step: "otp",
          email: formData.email,
          otpSentAt: sentAt,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.userOtp) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register/verify-otp", {
        email: formData.email,
        otp: formData.userOtp,
      });
      toast.success("Email verified!");
      setStep("role");
      localStorage.setItem(
        REG_KEY,
        JSON.stringify({ step: "role", email: formData.email }),
      );
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setFormData((prev) => ({ ...prev, userOtp: "" }));
    setLoading(true);
    try {
      await API.post("/auth/register/request-otp", { email: formData.email });
      toast.success("Code resent!");
      const sentAt = Date.now();
      setOtpSentAt(sentAt);
      setResendCooldown(60);
      localStorage.setItem(
        REG_KEY,
        JSON.stringify({
          step: "otp",
          email: formData.email,
          otpSentAt: sentAt,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (!passwordIsValid) {
      setError("Please meet all password requirements");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.role) {
      setError("Please select how you want to use CareerHub");
      return;
    }
    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      localStorage.removeItem(REG_KEY);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] overflow-hidden bg-app">
      <GradientMesh variant="register" />
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col auth-left-panel overflow-hidden">
        <div className="auth-orb auth-orb-1" aria-hidden="true" />
        <div className="auth-orb auth-orb-2" aria-hidden="true" />
        <div className="auth-orb auth-orb-3" aria-hidden="true" />

        <div className="flex flex-col justify-center flex-1 px-10 xl:px-14 gap-8 z-10">
          {/* Eyebrow */}
          <div
            className="flex items-center gap-2 animate-fadeIn"
            style={{ animationDelay: "0ms" }}
          >
            <span className="auth-eyebrow-dot" />
            <span className="auth-panel-eyebrow text-xs font-semibold tracking-widest uppercase">
              Free to join, always
            </span>
          </div>

          {/* Headline */}
          <div
            className="space-y-3 animate-fadeIn"
            style={{ animationDelay: "80ms" }}
          >
            <h1 className="text-5xl xl:text-[3.25rem] font-extrabold auth-panel-heading leading-[1.1] tracking-tight">
              Build the career
              <br />
              <span className="auth-gradient-text">you deserve.</span>
            </h1>
            <p className="auth-panel-muted text-sm leading-relaxed">
              Create your profile once, apply everywhere. CareerHub connects you
              with the right opportunities.
            </p>
          </div>

          {/* Feature cards */}
          <div
            className="grid grid-cols-2 gap-2 animate-fadeIn"
            style={{ animationDelay: "160ms" }}
          >
            {LEFT_FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="auth-glass-card auth-glass-card--hover flex items-center gap-3 py-2.5 px-3"
                style={{ animationDelay: `${160 + i * 60}ms` }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 auth-feature-icon">
                  <Icon
                    className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <p className="auth-panel-heading text-xs font-semibold">
                    {title}
                  </p>
                  <p className="auth-panel-muted text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sparkle badge */}
          <div className="animate-fadeIn" style={{ animationDelay: "340ms" }}>
            <div className="inline-flex items-center gap-2 auth-glass-card py-2 px-3">
              <Sparkles
                className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400"
                aria-hidden="true"
              />
              <span className="auth-panel-muted text-xs font-medium">
                No credit card required · Cancel anytime
              </span>
            </div>
          </div>
        </div>

        <p className="auth-panel-muted text-xs px-10 xl:px-14 pb-5 z-10">
          © {new Date().getFullYear()} CareerHub. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex items-center justify-center px-6 py-8 overflow-y-auto min-h-0">
        <div className="w-full max-w-sm lg:max-w-md animate-slideUp">
          {/* Form card */}
          <div className="auth-form-card">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="auth-brand-icon">
                  <Zap className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </div>
                <span className="auth-form-badge">Create your account</span>
              </div>
              <h2 className="text-[1.6rem] font-bold text-primary tracking-tight leading-tight mb-1.5">
                Get started free
              </h2>
              <p className="text-secondary text-sm">
                It only takes a minute to join CareerHub
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center mb-7">
              {STEPS.map((label, i) => {
                const current = STEP_INDEX[step];
                const done = i < current;
                const active = i === current;
                return (
                  <div
                    key={label}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${
                          done
                            ? "bg-blue-600 text-white"
                            : active
                              ? "bg-blue-600 text-white animate-pulse-ring"
                              : "bg-gray-100 dark:bg-slate-800 text-muted"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium transition-colors
                        ${
                          active
                            ? "text-blue-600 dark:text-blue-400"
                            : done
                              ? "text-secondary"
                              : "text-muted"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-2 mb-4 transition-all duration-500
                        ${done ? "bg-blue-600" : "auth-divider"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="auth-label">
                    Email address
                  </label>
                  <div className="input-icon-wrap">
                    <span className="input-icon" aria-hidden="true">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>
                {error && <ErrorBox message={error} />}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending code…</span>
                      </>
                    ) : (
                      <>
                        <span>Send verification code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px auth-divider" />
                  <span className="text-xs text-muted">or</span>
                  <div className="flex-1 h-px auth-divider" />
                </div>
                <p className="text-center text-sm text-secondary">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link font-semibold">
                    Sign in →
                  </Link>
                </p>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                <button
                  type="button"
                  onClick={() => { setError(""); setStep("email"); }}
                  className="auth-back-btn mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change email</span>
                </button>
                <div className="auth-info-box">
                  <Mail
                    className="w-3.5 h-3.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-xs">
                    Code sent to{" "}
                    <span className="font-semibold">{formData.email}</span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="reg-otp" className="auth-label">
                    Verification code
                  </label>
                  <input
                    id="reg-otp"
                    type="text"
                    name="userOtp"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    value={formData.userOtp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        userOtp: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="auth-otp-input"
                    autoComplete="one-time-code"
                  />
                </div>
                {error && <ErrorBox message={error} />}
                <div className="pt-1 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying…</span>
                      </>
                    ) : (
                      <>
                        <span>Verify code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendCooldown > 0}
                    className="auth-secondary-btn"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 3: Account ── */}
            {step === "role" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => { setError(""); setStep("otp"); }}
                  className="auth-back-btn mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to verify</span>
                </button>
                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="auth-label">
                    Password
                  </label>
                  <div className="input-icon-wrap">
                    <span className="input-icon" aria-hidden="true">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="input-icon-btn"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="grid grid-cols-2 gap-1.5 mt-2 p-3 auth-rules-box">
                      {passwordChecks.map((rule) => (
                        <div
                          key={rule.key}
                          className={`flex items-center gap-1.5 text-xs transition-colors
                          ${rule.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}`}
                        >
                          {rule.ok ? (
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 flex-shrink-0" />
                          )}
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm" className="auth-label">
                    Confirm password
                  </label>
                  <div className="input-icon-wrap">
                    <span className="input-icon" aria-hidden="true">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="input-icon-btn"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="auth-label">I want to</label>
                  <div className="grid grid-cols-2 gap-3">
                    <RoleCard
                      icon={Briefcase}
                      title="Find Jobs"
                      subtitle="Job Seeker"
                      selected={formData.role === "seeker"}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "seeker" }))
                      }
                    />
                    <RoleCard
                      icon={Building2}
                      title="Hire Talent"
                      subtitle="Recruiter"
                      selected={formData.role === "recruiter"}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "recruiter" }))
                      }
                    />
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <div className="pt-1">
                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="auth-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating account…</span>
                      </>
                    ) : (
                      <>
                        <span>Create my account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div
            className="flex items-center justify-center gap-5 mt-5"
            aria-hidden="true"
          >
            {["OTP Verified", "Secure", "Free Forever"].map((b) => (
              <div key={b} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-emerald-500" />
                <span className="text-xs text-muted">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, subtitle, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`auth-role-card ${selected ? "auth-role-card--selected" : ""}`}
    >
      <div
        className={`w-9 h-9 rounded-xl mx-auto mb-2.5 flex items-center justify-center transition-all
        ${selected ? "bg-blue-600" : "bg-gray-100 dark:bg-slate-700"}`}
      >
        <Icon className={`w-4 h-4 ${selected ? "text-white" : "text-muted"}`} />
      </div>
      <p className="text-sm font-bold text-primary">{title}</p>
      <p className="text-xs text-secondary mt-0.5">{subtitle}</p>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl">
      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold leading-none">!</span>
      </div>
      <p className="text-red-600 dark:text-red-400 text-xs leading-relaxed">
        {message}
      </p>
    </div>
  );
}
