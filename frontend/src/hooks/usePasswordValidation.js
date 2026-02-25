import { useMemo } from "react";

export function usePasswordValidation(password) {
  const rules = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const isValid = useMemo(() => Object.values(rules).every(Boolean), [rules]);

  return { rules, isValid };
}
