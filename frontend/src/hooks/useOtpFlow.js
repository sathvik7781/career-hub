import { useEffect, useState } from "react";

const OTP_COOLDOWN_SECONDS = 60;

export function useOtpFlow(storageKey) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otpSentAt, setOtpSentAt] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const savedEmail = parsed.email || "";
      const savedStep = parsed.step || "email";
      const savedOtpSentAt = parsed.otpSentAt || null;

      setEmail(savedEmail);
      setStep(savedStep === "otp" && !savedEmail ? "email" : savedStep);
      setOtpSentAt(savedOtpSentAt);

      if (savedOtpSentAt) {
        const elapsed = Math.floor((Date.now() - savedOtpSentAt) / 1000);
        const remaining = Math.max(0, OTP_COOLDOWN_SECONDS - elapsed);
        setResendCooldown(remaining);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ step, email, otpSentAt }),
    );
  }, [storageKey, step, email, otpSentAt]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpSent = () => {
    if (!email) {
      setStep("email");
      return;
    }

    const sentAt = Date.now();
    setStep("otp");
    setOtpSentAt(sentAt);
    setResendCooldown(OTP_COOLDOWN_SECONDS);
  };

  const resetFlow = () => {
    setStep("email");
    setEmail("");
    setOtpSentAt(null);
    setResendCooldown(0);
    localStorage.removeItem(storageKey);
  };

  return {
    step,
    setStep,
    email,
    setEmail,
    otpSentAt,
    resendCooldown,
    handleOtpSent,
    resetFlow,
  };
}
