import React from "react";
import { Button, Input } from "../UI/FormElements";
import PasswordRules from "./PasswordRules";

export default function PasswordStep({
  password,
  confirmPassword,
  onChange,
  passwordRules,
  onSubmit,
  loading,
  error,
  buttonText = "Submit",
  children,
}) {
  return (
    <div className="space-y-5">
      <div>
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="New password"
          value={password}
          onChange={onChange}
        />
        <PasswordRules rules={passwordRules} />
      </div>

      <Input
        label="Confirm password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={onChange}
      />

      {children}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <Button
        onClick={onSubmit}
        isLoading={loading}
        variant="primary"
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
}
