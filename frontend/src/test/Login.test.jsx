import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import Login from "@/pages/Login";

vi.mock("@/api/api", () => ({
  default: {
    defaults: { headers: { common: {} } },
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

// GradientMesh uses CSS classes that don't matter in tests
vi.mock("@/components/GradientMesh", () => ({ default: () => null }));

afterEach(() => { cleanup(); sessionStorage.clear(); });

const mockLogin = vi.fn();

function renderLogin(loginFn = mockLogin) {
  return render(
    <AuthContext.Provider value={{ user: { token: null }, login: loginFn, loading: false }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Login page", () => {
  beforeEach(() => mockLogin.mockReset());

  it("renders login form by default", () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeTruthy();
    expect(document.getElementById("login-password")).toBeTruthy();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy();
  });

  it("clicking Forgot password switches to forgot mode", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    expect(screen.getByText(/forgot your password/i)).toBeTruthy();
  });

  it("login submit calls login() from context", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "a@b.com" } });
    fireEvent.change(document.getElementById("login-password"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("a@b.com", "pass123"));
  });

  it("empty fields do not call login()", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("forgot mode: empty email shows error", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => expect(screen.getByText(/email address is required/i)).toBeTruthy());
  });

  it("otp mode: short OTP shows error", async () => {
    const API = (await import("@/api/api")).default;
    API.post.mockResolvedValueOnce({});
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => screen.getByText(/check your inbox/i));
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    await waitFor(() => expect(screen.getByText("Please enter the 6-digit code")).toBeTruthy());
  });

  it("reset mode: mismatched passwords shows error", async () => {
    const API = (await import("@/api/api")).default;
    API.post
      .mockResolvedValueOnce({}) // send OTP
      .mockResolvedValueOnce({ data: { data: { resetToken: "tok" } } }); // verify OTP
    renderLogin();
    // go to forgot
    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() => screen.getByText(/check your inbox/i));
    // enter 6-digit OTP
    fireEvent.change(screen.getByLabelText(/verification code/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));
    await waitFor(() => screen.getByText(/create new password/i));
    // enter mismatched passwords
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: "Abcdef1@" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "Different1@" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => expect(screen.getByText(/passwords do not match/i)).toBeTruthy());
  });

  it("back to sign in resets mode to login", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    expect(screen.getByText(/forgot your password/i)).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: /back to sign in/i })[0]);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy();
  });
});
