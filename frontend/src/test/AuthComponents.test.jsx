import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import EmailStep from "@/components/auth/EmailStep";
import OtpStep from "@/components/auth/OtpStep";
import RoleSection from "@/components/auth/RoleSection";

afterEach(cleanup);

// ── EmailStep ──────────────────────────────────────────────
describe("EmailStep", () => {
  it("renders email input and submit button", () => {
    render(<EmailStep email="" setEmail={() => {}} onSubmit={() => {}} loading={false} buttonText="Send OTP" />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /send otp/i })).toBeTruthy();
  });

  it("shows error message when error prop is set", () => {
    render(<EmailStep email="" setEmail={() => {}} onSubmit={() => {}} loading={false} error="Email not found" />);
    expect(screen.getByText("Email not found")).toBeTruthy();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(<EmailStep email="a@b.com" setEmail={() => {}} onSubmit={onSubmit} loading={false} buttonText="Send OTP" />);
    fireEvent.submit(screen.getByRole("button", { name: /send otp/i }).closest("form"));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

// ── OtpStep ───────────────────────────────────────────────
describe("OtpStep", () => {
  const baseProps = {
    email: "a@b.com", otp: "", setOtp: () => {},
    onVerify: () => {}, onResend: () => {},
    loading: false, error: "", resendCooldown: 0,
  };

  it("renders disabled email and OTP input", () => {
    render(<OtpStep {...baseProps} />);
    const emailInput = screen.getByDisplayValue("a@b.com");
    expect(emailInput.disabled).toBe(true);
    expect(screen.getByPlaceholderText(/6-digit/i)).toBeTruthy();
  });

  it("shows resend cooldown text when cooldown > 0", () => {
    render(<OtpStep {...baseProps} resendCooldown={30} />);
    expect(screen.getByText(/resend otp in 30s/i)).toBeTruthy();
  });

  it("resend button disabled during cooldown", () => {
    render(<OtpStep {...baseProps} resendCooldown={10} />);
    const resendBtn = screen.getByRole("button", { name: /resend otp in/i });
    expect(resendBtn.disabled).toBe(true);
  });

  it("shows error message", () => {
    render(<OtpStep {...baseProps} error="Invalid OTP" />);
    expect(screen.getByText("Invalid OTP")).toBeTruthy();
  });
});

// ── RoleSection ───────────────────────────────────────────
describe("RoleSection", () => {
  it("renders both role cards", () => {
    render(<RoleSection role="" setRole={() => {}} />);
    expect(screen.getByText("Find Jobs")).toBeTruthy();
    expect(screen.getByText("Hire Talent")).toBeTruthy();
  });

  it("clicking seeker card calls setRole with seeker", () => {
    const setRole = vi.fn();
    render(<RoleSection role="" setRole={setRole} />);
    fireEvent.click(screen.getByText("Find Jobs").closest("div[class*='cursor-pointer']") || screen.getByText("Find Jobs").parentElement);
    expect(setRole).toHaveBeenCalledWith("seeker");
  });

  it("selected seeker card has ring styling", () => {
    render(<RoleSection role="seeker" setRole={() => {}} />);
    const card = screen.getByText("Find Jobs").closest("div[class*='cursor-pointer']") || screen.getByText("Find Jobs").parentElement;
    expect(card.className).toContain("ring-2");
  });
});
