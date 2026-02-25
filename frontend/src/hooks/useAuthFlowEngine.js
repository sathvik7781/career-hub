import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useOtpFlow } from "./useOtpFlow";
import { usePasswordValidation } from "./usePasswordValidation";

export function useAuthFlowEngine(config) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    step,
    setStep,
    email,
    setEmail,
    resendCooldown,
    handleOtpSent,
    resetFlow,
  } = useOtpFlow(config.storageKey);

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const { rules: passwordRules, isValid: passwordIsValid } =
    usePasswordValidation(formData.password);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requestOtpMutation = useMutation({ mutationFn: config.requestOtp });
  const verifyOtpMutation = useMutation({ mutationFn: config.verifyOtp });
  const finalActionMutation = useMutation({ mutationFn: config.finalAction });

  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required");
      return;
    }

    requestOtpMutation.mutate(email, {
      onSuccess: () => {
        toast.success(config.otpSentMessage);
        handleOtpSent();
      },
      onError: (err) => {
        setError(err.response?.data?.message || config.requestErrorFallback);
      },
    });
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email && !config.hasRole) {
      setError("Session expired. Please restart the process.");
      setStep("email");
      return;
    }

    if (!formData.otp || (config.otpLengthCheck && formData.otp.length !== 6)) {
      setError(
        config.missingOtpMessage || "Please enter the verification code",
      );
      return;
    }

    verifyOtpMutation.mutate(
      { email, otp: formData.otp },
      {
        onSuccess: () => {
          toast.success("OTP verified");
          setStep(config.hasRole ? "role" : "password");
        },
        onError: (err) => {
          setError(err.response?.data?.message || config.verifyErrorFallback);
        },
      },
    );
  };

  const handleResendOtp = () => {
    setError("");
    setFormData((prev) => ({ ...prev, otp: "" }));

    if (!email) {
      setError("Email address is required");
      return;
    }

    requestOtpMutation.mutate(email, {
      onSuccess: () => {
        toast.success(config.resendMessage || "OTP resent");
        handleOtpSent();
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Failed to resend OTP");
      },
    });
  };

  const handleFinalAction = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email && !config.hasRole) {
      setError("Session expired. Please restart the process.");
      setStep("email");
      return;
    }

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

    if (config.hasRole && !formData.role) {
      setError("Please select how you want to use Career Hub");
      return;
    }

    finalActionMutation.mutate(
      {
        email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: () => {
          toast.success(config.successMessage);
          resetFlow();
          if (config.redirectDelay) {
            setTimeout(() => {
              navigate(config.redirectPath);
            }, config.redirectDelay);
          } else {
            navigate(config.redirectPath);
          }
        },
        onError: (err) => {
          setError(err.response?.data?.message || config.finalErrorFallback);
        },
      },
    );
  };

  const isPending =
    requestOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    finalActionMutation.isPending;

  return {
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
  };
}
