import React from "react";

function PasswordRule({ ok, label }) {
  return (
    <p
      className={
        ok
          ? "text-green-600 dark:text-green-400"
          : "text-gray-500 dark:text-gray-400"
      }
    >
      {label}
    </p>
  );
}

export default function PasswordRules({ rules }) {
  return (
    <div className="mt-2 space-y-1 text-xs">
      <PasswordRule ok={rules.length} label="At least 8 characters" />
      <PasswordRule ok={rules.uppercase} label="One uppercase letter" />
      <PasswordRule ok={rules.lowercase} label="One lowercase letter" />
      <PasswordRule ok={rules.number} label="One number" />
      <PasswordRule ok={rules.special} label="One special character" />
    </div>
  );
}
