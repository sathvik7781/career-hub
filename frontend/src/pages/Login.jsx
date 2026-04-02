import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GradientMesh from "../components/GradientMesh";
import API from "../api/api";
import toast from "react-hot-toast";
import {
  Mail, Lock, Eye, EyeOff, CheckCircle2, TrendingUp,
  Bell, ArrowRight, ArrowLeft, Loader2, Briefcase, Users,
  Building2, Star, Zap, KeyRound, ShieldCheck, Circle,
} from "lucide-react";

const STATS = [
  { value: "12k+", label: "Companies",   icon: Building2 },
  { value: "85k+", label: "Active Jobs", icon: Briefcase },
  { value: "2M+",  label: "Seekers",     icon: Users },
];

const TRUST_BADGES = ["OTP Verified", "Secure Login", "256-bit SSL"];

const PASSWORD_RULES = [
  { key: "length",    label: "8+ characters",      test: (p) => p.length >= 8 },
  { key: "uppercase", label: "Uppercase letter",    test: (p) => /[A-Z]/.test(p) },
  { key: "lowercase", label: "Lowercase letter",    test: (p) => /[a-z]/.test(p) },
  { key: "number",    label: "One number",          test: (p) => /\d/.test(p) },
  { key: "special",   label: "Special character",   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Login() {
  const { login } = useContext(AuthContext);

  // login state
  const [loginData, setLoginData]       = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // mode: "login" | "forgot" | "otp" | "reset" — persisted so refresh doesn't reset it
  const [mode, setMode] = useState(() => sessionStorage.getItem("ch_fp_mode") || "login");

  const goToMode = (m) => { sessionStorage.setItem("ch_fp_mode", m); setMode(m); };

  // forgot password state
  const [fpData, setFpData]             = useState({ email: "", otp: "", password: "", confirmPassword: "", resetToken: "" });
  const [showNewPw, setShowNewPw]       = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [fpLoading, setFpLoading]       = useState(false);
  const [fpError, setFpError]           = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const passwordChecks = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(fpData.password) }));
  const passwordIsValid = passwordChecks.every((r) => r.ok);

  const handleLoginChange = (e) =>
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFpChange = (e) =>
    setFpData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) return;
    setLoginLoading(true);
    await login(loginData.email.trim(), loginData.password.trim());
    setLoginLoading(false);
  };

  const switchToForgot = () => {
    setFpError("");
    setFpData({ email: loginData.email, otp: "", password: "", confirmPassword: "", resetToken: "" });
    goToMode("forgot");
  };

  const backToLogin = () => {
    setFpError("");
    goToMode("login");
    sessionStorage.removeItem("ch_fp_mode");
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => setResendCooldown((p) => {
      if (p <= 1) { clearInterval(t); return 0; }
      return p - 1;
    }), 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpData.email) { setFpError("Email address is required"); return; }
    setFpLoading(true);
    try {
      await API.post("/auth/forgot-password/request-otp", { email: fpData.email });
      toast.success("Verification code sent!");
      goToMode("otp");
      startCooldown();
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpData.otp || fpData.otp.length !== 6) { setFpError("Please enter the 6-digit code"); return; }
    setFpLoading(true);
    try {
      const res = await API.post("/auth/forgot-password/verify-otp", {
        email: fpData.email.trim(),
        otp: fpData.otp.trim(),
      });
      setFpData((prev) => ({ ...prev, resetToken: res.data.data.resetToken }));
      toast.success("Email verified!");
      goToMode("reset");
    } catch (err) {
      setFpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setFpError("");
    setFpData((prev) => ({ ...prev, otp: "" }));
    setFpLoading(true);
    try {
      await API.post("/auth/forgot-password/request-otp", { email: fpData.email });
      toast.success("Code resent!");
      startCooldown();
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to resend");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!passwordIsValid) { setFpError("Please meet all password requirements"); return; }
    if (fpData.password !== fpData.confirmPassword) { setFpError("Passwords do not match"); return; }
    setFpLoading(true);
    try {
      await API.post("/auth/forgot-password/reset", {
        email: fpData.email,
        newPassword: fpData.password,
        resetToken: fpData.resetToken,
      });
      toast.success("Password reset! Please sign in.");
      sessionStorage.removeItem("ch_fp_mode");
      setLoginData((prev) => ({ ...prev, email: fpData.email, password: "" }));
      goToMode("login");
    } catch (err) {
      setFpError(err.response?.data?.message || "Reset failed");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] overflow-hidden bg-app">
      <GradientMesh variant="login" />

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col auth-left-panel overflow-hidden">
        <div className="auth-orb auth-orb-1" aria-hidden="true" />
        <div className="auth-orb auth-orb-2" aria-hidden="true" />
        <div className="auth-orb auth-orb-3" aria-hidden="true" />

        <div className="flex flex-col justify-center flex-1 px-10 xl:px-14 gap-8 z-10">
          <div className="flex items-center gap-2 animate-fadeIn" style={{ animationDelay: "0ms" }}>
            <span className="auth-eyebrow-dot" />
            <span className="auth-panel-eyebrow text-xs font-semibold tracking-widest uppercase">
              CareerHub Platform
            </span>
          </div>

          <div className="space-y-3 animate-fadeIn" style={{ animationDelay: "80ms" }}>
            <h1 className="text-5xl xl:text-[3.25rem] font-extrabold auth-panel-heading leading-[1.1] tracking-tight">
              Your next <span className="auth-gradient-text">great role</span>
              <br />starts here.
            </h1>
            <p className="auth-panel-muted text-sm leading-relaxed">
              Join 2M+ professionals who found their dream job through CareerHub.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 animate-fadeIn" style={{ animationDelay: "160ms" }}>
            <div className="auth-glass-card auth-glass-card--hover animate-float">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg auth-icon-wrap-emerald flex items-center justify-center flex-shrink-0">
                  <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <span className="auth-live-badge">live</span>
              </div>
              <p className="auth-panel-heading text-xs font-semibold leading-snug">New Interview Request</p>
              <p className="auth-panel-muted text-xs mt-1">Stripe Inc. wants to connect</p>
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 auth-card-divider">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <p className="auth-panel-muted text-xs">Top 10% this week</p>
              </div>
            </div>

            <div className="auth-glass-card auth-glass-card--hover animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" aria-hidden="true" />
                <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold">Top Match</span>
              </div>
              <p className="auth-panel-heading text-xs font-semibold leading-snug">Senior Frontend Engineer</p>
              <p className="auth-panel-muted text-xs mt-1">Vercel · Remote</p>
              <div className="flex items-center justify-between mt-2.5 pt-2 auth-card-divider">
                <span className="auth-panel-muted text-xs">$140k–$180k</span>
                <div className="auth-match-badge">98%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 animate-fadeIn" style={{ animationDelay: "240ms" }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="auth-stat-card">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-2" aria-hidden="true" />
                <p className="auth-panel-heading font-bold text-lg leading-none">{value}</p>
                <p className="auth-panel-muted text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="auth-panel-muted text-xs px-10 xl:px-14 pb-5 z-10">
          © {new Date().getFullYear()} CareerHub. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex items-center justify-center px-6 py-10 overflow-y-auto min-h-0">
        <div className="w-full max-w-sm lg:max-w-md animate-slideUp">

          <div className="auth-form-card">

            {/* ── LOGIN ── */}
            {mode === "login" && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="auth-brand-icon">
                      <Zap className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="auth-form-badge">Welcome back</span>
                  </div>
                  <h2 className="text-[1.6rem] font-bold text-primary tracking-tight leading-tight mb-1.5">
                    Sign in to CareerHub
                  </h2>
                  <p className="text-secondary text-sm">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="auth-label">Email address</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon" aria-hidden="true"><Mail className="w-4 h-4" /></span>
                      <input
                        id="login-email" type="email" name="email"
                        placeholder="you@example.com"
                        value={loginData.email} onChange={handleLoginChange}
                        required autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="auth-label">Password</label>
                      <button type="button" onClick={switchToForgot} className="auth-link text-xs">
                        Forgot password?
                      </button>
                    </div>
                    <div className="input-icon-wrap">
                      <span className="input-icon" aria-hidden="true"><Lock className="w-4 h-4" /></span>
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        name="password" placeholder="••••••••••"
                        value={loginData.password} onChange={handleLoginChange}
                        required autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPassword((p) => !p)} className="input-icon-btn"
                        aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button type="submit" disabled={loginLoading} className="auth-submit-btn">
                      {loginLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
                        : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                </form>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px auth-divider" />
                  <span className="text-xs text-muted">or</span>
                  <div className="flex-1 h-px auth-divider" />
                </div>
                <p className="text-center text-sm text-secondary">
                  Don't have an account?{" "}
                  <Link to="/register" className="auth-link font-semibold">Create one free →</Link>
                </p>
              </>
            )}

            {/* ── FORGOT: enter email ── */}
            {mode === "forgot" && (
              <>
                <div className="mb-7">
                  <button type="button" onClick={backToLogin} className="auth-back-btn mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to sign in</span>
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="auth-brand-icon">
                      <KeyRound className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="auth-form-badge">Password reset</span>
                  </div>
                  <h2 className="text-[1.6rem] font-bold text-primary tracking-tight leading-tight mb-1.5">
                    Forgot your password?
                  </h2>
                  <p className="text-secondary text-sm">
                    Enter your email and we'll send a verification code.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="fp-email" className="auth-label">Email address</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon" aria-hidden="true"><Mail className="w-4 h-4" /></span>
                      <input
                        id="fp-email" type="email" name="email"
                        placeholder="you@example.com"
                        value={fpData.email} onChange={handleFpChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  {fpError && <ErrorBox message={fpError} />}
                  <div className="pt-1 space-y-2">
                    <button type="submit" disabled={fpLoading} className="auth-submit-btn">
                      {fpLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending code…</span></>
                        : <><span>Send verification code</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <button type="button" onClick={backToLogin} className="auth-secondary-btn">Back to sign in</button>
                  </div>
                </form>
              </>
            )}

            {/* ── FORGOT: verify OTP ── */}
            {mode === "otp" && (
              <>
                <div className="mb-7">
                  <button type="button" onClick={() => { setFpError(""); goToMode("forgot"); }} className="auth-back-btn mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change email</span>
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="auth-brand-icon">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="auth-form-badge">Verify your email</span>
                  </div>
                  <h2 className="text-[1.6rem] font-bold text-primary tracking-tight leading-tight mb-1.5">
                    Check your inbox
                  </h2>
                  <p className="text-secondary text-sm">
                    We sent a 6-digit code to <span className="font-semibold text-primary">{fpData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="fp-otp" className="auth-label">Verification code</label>
                    <input
                      id="fp-otp" type="text" name="otp"
                      maxLength={6} inputMode="numeric" pattern="[0-9]*"
                      placeholder="000000"
                      value={fpData.otp}
                      onChange={(e) => setFpData((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, "") }))}
                      className="auth-otp-input"
                      autoComplete="one-time-code"
                    />
                  </div>
                  {fpError && <ErrorBox message={fpError} />}
                  <div className="pt-1 space-y-2">
                    <button type="submit" disabled={fpLoading} className="auth-submit-btn">
                      {fpLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying…</span></>
                        : <><span>Verify code</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <button type="button" onClick={handleResendOtp}
                      disabled={fpLoading || resendCooldown > 0} className="auth-secondary-btn">
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                    </button>
                    <button type="button" onClick={backToLogin} className="auth-secondary-btn">Back to sign in</button>
                  </div>
                </form>
              </>
            )}

            {/* ── FORGOT: new password ── */}
            {mode === "reset" && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="auth-brand-icon">
                      <Lock className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="auth-form-badge">Set new password</span>
                  </div>
                  <h2 className="text-[1.6rem] font-bold text-primary tracking-tight leading-tight mb-1.5">
                    Create new password
                  </h2>
                  <p className="text-secondary text-sm">Make it strong and memorable.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="fp-password" className="auth-label">New password</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon" aria-hidden="true"><Lock className="w-4 h-4" /></span>
                      <input
                        id="fp-password" type={showNewPw ? "text" : "password"}
                        name="password" placeholder="Create a strong password"
                        value={fpData.password} onChange={handleFpChange}
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowNewPw((p) => !p)} className="input-icon-btn"
                        aria-label={showNewPw ? "Hide" : "Show"}>
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fpData.password && (
                      <div className="grid grid-cols-2 gap-1.5 mt-2 p-3 auth-rules-box">
                        {passwordChecks.map((rule) => (
                          <div key={rule.key} className={`flex items-center gap-1.5 text-xs transition-colors
                            ${rule.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}`}>
                            {rule.ok ? <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> : <Circle className="w-3 h-3 flex-shrink-0" />}
                            {rule.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="fp-confirm" className="auth-label">Confirm password</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon" aria-hidden="true"><Lock className="w-4 h-4" /></span>
                      <input
                        id="fp-confirm" type={showConfirmPw ? "text" : "password"}
                        name="confirmPassword" placeholder="Re-enter your password"
                        value={fpData.confirmPassword} onChange={handleFpChange}
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowConfirmPw((p) => !p)} className="input-icon-btn"
                        aria-label={showConfirmPw ? "Hide" : "Show"}>
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {fpError && <ErrorBox message={fpError} />}

                  <div className="pt-1 space-y-2">
                    <button type="submit" disabled={fpLoading} className="auth-submit-btn">
                      {fpLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Resetting…</span></>
                        : <><span>Reset password</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <button type="button" onClick={backToLogin} className="auth-secondary-btn">Back to sign in</button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-5 mt-5" aria-hidden="true">
            {TRUST_BADGES.map((b) => (
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

function ErrorBox({ message }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl">
      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold leading-none">!</span>
      </div>
      <p className="text-red-600 dark:text-red-400 text-xs leading-relaxed">{message}</p>
    </div>
  );
}
