import React from "react";
import { Button, Input } from "../UI/FormElements";

export default function EmailStep({
  email,
  setEmail,
  onSubmit,
  loading,
  error,
  buttonText = "Send OTP",
  children,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Email address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        isLoading={loading}
        variant="primary"
        className="w-full"
      >
        {buttonText}
      </Button>

      {children}
    </form>
  );
}
