import { authService } from "../services/authService";
import registerImage from "../assets/images/registerImage.png";

export const authConfigs = {
  register: {
    requestOtp: (email) => authService.requestRegisterOtp(email),
    verifyOtp: (payload) =>
      authService.verifyRegisterOtp(payload.email, payload.otp),
    finalAction: (payload) =>
      authService.register({
        email: payload.email,
        password: payload.password,
        role: payload.role,
      }),
    hasRole: true,
    successMessage: "Account created successfully",
    otpSentMessage: "OTP sent to your email",
    resendMessage: "OTP resent to your email",
    verifyErrorFallback: "OTP verification failed",
    requestErrorFallback: "Failed to send OTP",
    finalErrorFallback: "Registration failed",
    missingOtpMessage: "Please enter the verification code",
    otpLengthCheck: false,
    title: "Create your Career Hub account",
    subtitle: "Connecting talent with opportunity",
    buttonTextEmail: "Generate OTP",
    buttonText: "Create Account",
    redirectPath: "/login",
    redirectDelay: 1000,
    storageKey: "careerhub_register_progress",
    showLoginLink: true,
    layout: "split",
    imageUrl: registerImage,
  },
  forgot: {
    requestOtp: (email) => authService.requestForgotOtp(email),
    verifyOtp: (payload) =>
      authService.verifyForgotOtp(payload.email, payload.otp),
    finalAction: (payload) =>
      authService.resetPassword(payload.email, payload.password),
    hasRole: false,
    successMessage: "Password reset successful",
    otpSentMessage: "OTP sent to your email",
    resendMessage: "OTP resent",
    verifyErrorFallback: "Invalid OTP",
    requestErrorFallback: "Failed to send OTP",
    finalErrorFallback: "Reset failed",
    missingOtpMessage: "Please enter the 6-digit OTP",
    otpLengthCheck: true,
    title: "Reset your password",
    subtitle: "",
    buttonTextEmail: "Send OTP",
    buttonText: "Reset Password",
    redirectPath: "/login",
    redirectDelay: 0,
    storageKey: "careerhub_forgot_password_progress",
    showLoginLink: false,
    layout: "centered",
  },
};
