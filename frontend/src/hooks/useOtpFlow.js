import { useState, useEffect } from "react";

export function useOtpFlow(storageKey) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSentAt, setOtpSentAt] = useState(null);
  const [isRestored, setIsRestored] = useState(false);

  // Restore state on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.step) setStep(parsed.step);
        if (parsed.otpSentAt) {
          setOtpSentAt(parsed.otpSentAt);
          const elapsed = Math.floor((Date.now() - parsed.otpSentAt) / 1000);
          const remaining = 60 - elapsed;
          if (remaining > 0) {
            setResendCooldown(remaining);
          }
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    setIsRestored(true);
  }, [storageKey]);

  // Persist state on change
  useEffect(() => {
    if (!isRestored) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        step,
        email,
        otpSentAt,
      }),
    );
  }, [step, email, otpSentAt, storageKey, isRestored]);

  // Handle fallback if no email is present
  useEffect(() => {
    if (isRestored && step !== "email" && !email) {
      setStep("email");
    }
  }, [step, email, isRestored]);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpSent = () => {
    setOtpSentAt(Date.now());
    setResendCooldown(60);
    setStep("otp");
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
    resendCooldown,
    handleOtpSent,
    resetFlow,
  };
}
