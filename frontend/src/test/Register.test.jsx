import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import Register from "@/pages/Register";

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));
vi.mock("@/api/api", () => ({ default: { defaults: { headers: { common: {} } }, post: mockPost } }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() }, toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/GradientMesh", () => ({ default: () => null }));

const mockRegister = vi.fn();

afterEach(() => { cleanup(); localStorage.clear(); mockPost.mockReset(); mockRegister.mockReset(); });

function renderRegister() {
  return render(
    <AuthContext.Provider value={{ register: mockRegister, user: { token: null }, loading: false }}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// ── Step 1: Email ─────────────────────────────────────────────────────────────
describe("Register — email step", () => {
  it("renders email input and send code button", () => {
    renderRegister();
    expect(document.getElementById("reg-email")).toBeTruthy();
    expect(screen.getByRole("button", { name: /send verification code/i })).toBeTruthy();
  });

  it("shows Sign in link", () => {
    renderRegister();
    expect(screen.getByText(/sign in/i)).toBeTruthy();
  });

  it("shows error when email is empty on submit", async () => {
    renderRegister();
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => expect(screen.getByText(/email address is required/i)).toBeTruthy());
  });

  it("calls API and advances to OTP step on success", async () => {
    mockPost.mockResolvedValueOnce({});
    renderRegister();
    fireEvent.change(document.getElementById("reg-email"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /verify code/i })).toBeTruthy());
    expect(mockPost).toHaveBeenCalledWith("/auth/register/request-otp", { email: "a@b.com" });
  });

  it("shows API error when send OTP fails", async () => {
    mockPost.mockRejectedValueOnce({ response: { data: { message: "Email already registered" } } });
    renderRegister();
    fireEvent.change(document.getElementById("reg-email"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => expect(screen.getByText(/email already registered/i)).toBeTruthy());
  });
});

// ── Step 2: OTP ───────────────────────────────────────────────────────────────
describe("Register — OTP step", () => {
  async function goToOtp() {
    mockPost.mockResolvedValueOnce({});
    renderRegister();
    fireEvent.change(document.getElementById("reg-email"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => screen.getByRole("button", { name: /verify code/i }));
  }

  it("shows OTP input and verify button", async () => {
    await goToOtp();
    expect(document.getElementById("reg-otp")).toBeTruthy();
    expect(screen.getByRole("button", { name: /verify code/i })).toBeTruthy();
  });

  it("shows error when OTP is empty on submit", async () => {
    await goToOtp();
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    await waitFor(() => expect(screen.getByText(/please enter the verification code/i)).toBeTruthy());
  });

  it("advances to account step on valid OTP", async () => {
    await goToOtp();
    mockPost.mockResolvedValueOnce({});
    fireEvent.change(document.getElementById("reg-otp"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /create my account/i })).toBeTruthy());
  });

  it("shows resend button and calls API on resend", async () => {
    await goToOtp();
    mockPost.mockResolvedValueOnce({});
    // cooldown is active after OTP sent, button shows "Resend in Xs" — click it directly
    fireEvent.click(screen.getByRole("button", { name: /resend in/i }));
    await waitFor(() => expect(mockPost).toHaveBeenCalledWith("/auth/register/request-otp", { email: "a@b.com" }));
  });

  it("back button returns to email step", async () => {
    await goToOtp();
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    expect(screen.getByRole("button", { name: /send verification code/i })).toBeTruthy();
  });
});

// ── Step 3: Account ───────────────────────────────────────────────────────────
describe("Register — account step", () => {
  async function goToAccount() {
    mockPost.mockResolvedValueOnce({}).mockResolvedValueOnce({});
    renderRegister();
    fireEvent.change(document.getElementById("reg-email"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => screen.getByRole("button", { name: /verify code/i }));
    fireEvent.change(document.getElementById("reg-otp"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    await waitFor(() => screen.getByRole("button", { name: /create my account/i }));
  }

  it("renders password, confirm password and role cards", async () => {
    await goToAccount();
    expect(document.getElementById("reg-password")).toBeTruthy();
    expect(document.getElementById("reg-confirm")).toBeTruthy();
    expect(screen.getByText("Find Jobs")).toBeTruthy();
    expect(screen.getByText("Hire Talent")).toBeTruthy();
  });

  it("shows error when password is empty", async () => {
    await goToAccount();
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));
    await waitFor(() => expect(screen.getByText(/password is required/i)).toBeTruthy());
  });

  it("shows error when passwords do not match", async () => {
    await goToAccount();
    fireEvent.change(document.getElementById("reg-password"), { target: { value: "Abcdef1@" } });
    fireEvent.change(document.getElementById("reg-confirm"), { target: { value: "Different1@" } });
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));
    await waitFor(() => expect(screen.getByText(/passwords do not match/i)).toBeTruthy());
  });

  it("shows error when no role selected", async () => {
    await goToAccount();
    fireEvent.change(document.getElementById("reg-password"), { target: { value: "Abcdef1@" } });
    fireEvent.change(document.getElementById("reg-confirm"), { target: { value: "Abcdef1@" } });
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));
    await waitFor(() => expect(screen.getByText(/please select how you want/i)).toBeTruthy());
  });

  it("calls register() with correct payload on valid submit", async () => {
    mockRegister.mockResolvedValue({});
    await goToAccount();
    fireEvent.change(document.getElementById("reg-password"), { target: { value: "Abcdef1@" } });
    fireEvent.change(document.getElementById("reg-confirm"), { target: { value: "Abcdef1@" } });
    fireEvent.click(screen.getByText("Find Jobs").closest("div[class*='auth-role-card']") || screen.getByText("Find Jobs").parentElement);
    fireEvent.click(screen.getByRole("button", { name: /create my account/i }));
    await waitFor(() => expect(mockRegister).toHaveBeenCalledWith({ email: "a@b.com", password: "Abcdef1@", role: "seeker" }));
  });
});
