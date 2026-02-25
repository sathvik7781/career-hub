import React from "react";
import { Button, Input } from "../UI/FormElements";

export default function OtpStep({
  email,
  otp,
  setOtp,
  onVerify,
  onResend,
  loading,
  error,
  resendCooldown,
}) {
  return (
    <form onSubmit={onVerify} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-primary">
          Email address
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-app rounded-lg px-3 py-2 bg-gray-100 dark:bg-slate-700 text-secondary"
        />
      </div>

      <div>
        <Input
          label="Verification code"
          type="text"
          name="otp"
          maxLength={6}
          inputMode="numeric"
          placeholder="Enter 6-digit code or OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />
        <p className="text-secondary text-xs mt-1">
          Enter the code sent to your email
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        isLoading={loading}
        variant="primary"
        className="w-full"
      >
        Verify OTP
      </Button>

      <Button
        type="button"
        onClick={onResend}
        disabled={loading || resendCooldown > 0}
        variant="outline"
        className="w-full"
      >
        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
      </Button>
    </form>
  );
}
