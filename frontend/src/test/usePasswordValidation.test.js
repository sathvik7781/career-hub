import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";

describe("usePasswordValidation", () => {
  it("all rules false for empty string", () => {
    const { result } = renderHook(() => usePasswordValidation(""));
    expect(result.current.isValid).toBe(false);
    expect(Object.values(result.current.rules).every((v) => v === false)).toBe(true);
  });

  it("length rule passes at 8+ chars", () => {
    const { result } = renderHook(() => usePasswordValidation("abcdefgh"));
    expect(result.current.rules.length).toBe(true);
  });

  it("uppercase rule passes with capital letter", () => {
    const { result } = renderHook(() => usePasswordValidation("A"));
    expect(result.current.rules.uppercase).toBe(true);
  });

  it("number rule passes with digit", () => {
    const { result } = renderHook(() => usePasswordValidation("1"));
    expect(result.current.rules.number).toBe(true);
  });

  it("special rule passes with special char", () => {
    const { result } = renderHook(() => usePasswordValidation("@"));
    expect(result.current.rules.special).toBe(true);
  });

  it("isValid true when all rules pass", () => {
    const { result } = renderHook(() => usePasswordValidation("Abcdefg1@"));
    expect(result.current.isValid).toBe(true);
  });
});
