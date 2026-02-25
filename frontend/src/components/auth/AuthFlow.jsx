import React from "react";
import { useNavigate } from "react-router-dom";
import { authConfigs } from "../../config/authConfigs";
import { useAuthFlowEngine } from "../../hooks/useAuthFlowEngine";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import PasswordStep from "./PasswordStep";
import RoleSection from "./RoleSection";

export default function AuthFlow({ mode }) {
  const navigate = useNavigate();
  const config = authConfigs[mode];

  if (!config) {
    return <div>Invalid auth mode</div>;
  }

  const {
    step,
    email,
    setEmail,
    formData,
    setFormData,
    handleChange,
    passwordRules,
    isPending,
    error,
    resendCooldown,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleFinalAction,
  } = useAuthFlowEngine(config);

  const FormContainer = (
    <div
      className="w-full max-w-md animate-slideUp bg-surface rounded-2xl px-8 py-10 
                 border border-app shadow-lg transition-shadow duration-300 relative"
    >
      <h1
        className={`text-2xl ${config.layout === "split" ? "font-bold tracking-tight" : "font-semibold"} mb-2 text-primary`}
      >
        {config.title}
      </h1>

      {config.subtitle && (
        <p className="text-secondary mb-8 text-sm">{config.subtitle}</p>
      )}

      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onSubmit={handleSendOtp}
          loading={isPending}
          error={error}
          buttonText={config.buttonTextEmail}
        >
          {config.showLoginLink && (
            <p className="text-center mt-2 text-primary">
              Have an account?
              <a
                onClick={() => navigate("/login")}
                className="text-blue-600 dark:text-blue-400 font-medium px-1 cursor-pointer hover:underline"
              >
                Sign in
              </a>
            </p>
          )}
        </EmailStep>
      )}

      {step === "otp" && (
        <OtpStep
          email={email}
          otp={formData.otp}
          setOtp={(val) => setFormData((prev) => ({ ...prev, otp: val }))}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          loading={isPending}
          error={error}
          resendCooldown={resendCooldown}
        />
      )}

      {(step === "role" || step === "password") && (
        <PasswordStep
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onChange={handleChange}
          passwordRules={passwordRules}
          onSubmit={handleFinalAction}
          loading={isPending}
          error={error}
          buttonText={config.buttonText}
        >
          {config.hasRole && (
            <RoleSection
              role={formData.role}
              setRole={(role) => setFormData((prev) => ({ ...prev, role }))}
            />
          )}
        </PasswordStep>
      )}
    </div>
  );

  if (config.layout === "split") {
    return (
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 bg-app">
        <div className="hidden lg:flex items-center justify-center bg-blue-600 dark:bg-slate-800">
          <img
            src={config.imageUrl}
            alt="Career Hub"
            className="max-w-[80%] animate-fadeIn"
          />
        </div>
        <div className="flex items-center justify-center px-6 py-12">
          {FormContainer}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-app px-6">
      {FormContainer}
    </div>
  );
}
