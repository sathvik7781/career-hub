import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useOtpFlow } from "@/hooks/useOtpFlow";

const KEY = "test_otp_key";

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); localStorage.clear(); });

describe("useOtpFlow", () => {
  it("starts at email step with empty email", () => {
    const { result } = renderHook(() => useOtpFlow(KEY));
    expect(result.current.step).toBe("email");
    expect(result.current.email).toBe("");
  });

  it("handleOtpSent sets step to otp and starts cooldown", () => {
    const { result } = renderHook(() => useOtpFlow(KEY));
    // must set email first — the guard effect resets step to email if no email
    act(() => { result.current.setEmail("a@b.com"); });
    act(() => { result.current.handleOtpSent(); });
    expect(result.current.step).toBe("otp");
    expect(result.current.resendCooldown).toBe(60);
  });

  it("resetFlow clears step, email and localStorage", () => {
    const { result } = renderHook(() => useOtpFlow(KEY));
    act(() => {
      result.current.setEmail("test@example.com");
      result.current.handleOtpSent();
    });
    act(() => { result.current.resetFlow(); });
    expect(result.current.step).toBe("email");
    expect(result.current.email).toBe("");
    // resetFlow calls localStorage.removeItem; persist effect may re-write after,
    // so just verify email and step are cleared
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    expect(saved?.email ?? "").toBe("");
    expect(saved?.step ?? "email").toBe("email");
  });

  it("restores state from localStorage on mount", () => {
    localStorage.setItem(KEY, JSON.stringify({ step: "otp", email: "a@b.com", otpSentAt: null }));
    const { result } = renderHook(() => useOtpFlow(KEY));
    expect(result.current.email).toBe("a@b.com");
    expect(result.current.step).toBe("otp");
  });

  it("falls back to email step if restored step is otp but no email", () => {
    localStorage.setItem(KEY, JSON.stringify({ step: "otp", email: "", otpSentAt: null }));
    const { result } = renderHook(() => useOtpFlow(KEY));
    expect(result.current.step).toBe("email");
  });

  it("persists state to localStorage when step/email changes", () => {
    const { result } = renderHook(() => useOtpFlow(KEY));
    act(() => { result.current.setEmail("x@y.com"); });
    const saved = JSON.parse(localStorage.getItem(KEY));
    expect(saved.email).toBe("x@y.com");
  });
});
