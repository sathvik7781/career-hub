import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, AuthProvider } from "@/context/AuthContext";

// ── hoist mocks so they are available before vi.mock hoisting ─────────────────
const { mockPost, mockNavigate } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("@/api/api", () => ({
  default: {
    defaults: { headers: { common: {} } },
    post: mockPost,
  },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

afterEach(() => { cleanup(); localStorage.clear(); mockPost.mockReset(); mockNavigate.mockReset(); });

function renderProvider(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

// ── refreshSession ────────────────────────────────────────────────────────────
describe("AuthContext — refreshSession", () => {
  it("sets user from refresh-token response on mount", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "tok123", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: true, basicInfo: { profileImageUrl: "img.png" } } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );

    await waitFor(() => expect(ctxValue.user.token).toBe("tok123"));
    expect(ctxValue.user.email).toBe("a@b.com");
    expect(ctxValue.user.role).toBe("seeker");
    expect(ctxValue.user.profileImageUrl).toBe("img.png");
    expect(localStorage.getItem("accessToken")).toBe("tok123");
  });

  it("clears user when refresh-token fails", async () => {
    mockPost.mockRejectedValueOnce(new Error("401"));

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );

    await waitFor(() => expect(ctxValue.loading).toBe(false));
    expect(ctxValue.user.token).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});

// ── login ─────────────────────────────────────────────────────────────────────
describe("AuthContext — login", () => {
  beforeEach(() => {
    // first call is refreshSession on mount — make it fail fast
    mockPost.mockRejectedValueOnce(new Error("no session"));
  });

  it("sets user and navigates to /dashboard when profile complete", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "tok", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: true, basicInfo: {} } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await act(async () => { await ctxValue.login("a@b.com", "pass"); });

    expect(ctxValue.user.token).toBe("tok");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("navigates to /dashboard when profile incomplete", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "tok", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: false, basicInfo: {} } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await act(async () => { await ctxValue.login("a@b.com", "pass"); });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("stores accessToken in localStorage on login", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "mytoken", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: true, basicInfo: {} } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));
    await act(async () => { await ctxValue.login("a@b.com", "pass"); });

    expect(localStorage.getItem("accessToken")).toBe("mytoken");
  });
});

// ── logout ────────────────────────────────────────────────────────────────────
describe("AuthContext — logout", () => {
  beforeEach(() => {
    mockPost.mockRejectedValueOnce(new Error("no session"));
  });

  it("clears token and navigates to /login", async () => {
    localStorage.setItem("accessToken", "existing");
    mockPost.mockResolvedValueOnce({}); // logout API call

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await act(async () => { await ctxValue.logout(); });

    expect(ctxValue.user.token).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("still clears token even if logout API fails", async () => {
    localStorage.setItem("accessToken", "existing");
    mockPost.mockRejectedValueOnce(new Error("network"));

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await act(async () => { await ctxValue.logout(); });

    expect(ctxValue.user.token).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

// ── register ──────────────────────────────────────────────────────────────────
describe("AuthContext — register", () => {
  beforeEach(() => {
    mockPost.mockRejectedValueOnce(new Error("no session"));
  });

  it("sets user and navigates to /profile on register", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "regtok", user: { id: "u2", email: "b@c.com", role: "seeker", isProfileComplete: false, basicInfo: {} } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await act(async () => { await ctxValue.register({ email: "b@c.com", password: "Pass1@", role: "seeker" }); });

    expect(ctxValue.user.token).toBe("regtok");
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("throws on register failure", async () => {
    mockPost.mockRejectedValueOnce({ response: { data: { message: "Email taken" } } });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    await expect(
      act(async () => { await ctxValue.register({ email: "b@c.com", password: "Pass1@", role: "seeker" }); })
    ).rejects.toBeTruthy();
  });
});

// ── helpers ───────────────────────────────────────────────────────────────────
describe("AuthContext — helpers", () => {
  beforeEach(() => {
    mockPost.mockRejectedValueOnce(new Error("no session"));
  });

  it("updateProfileImage updates profileImageUrl", async () => {
    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    act(() => { ctxValue.updateProfileImage("new-img.png"); });
    expect(ctxValue.user.profileImageUrl).toBe("new-img.png");
  });

  it("updateProfileComplete updates isProfileComplete", async () => {
    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.loading).toBe(false));

    act(() => { ctxValue.updateProfileComplete(true); });
    expect(ctxValue.user.isProfileComplete).toBe(true);
  });

  it("isAuthenticated is true when token exists", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "tok", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: true, basicInfo: {} } } },
    });
    // override the rejected mock from beforeEach
    mockPost.mockReset();
    mockPost.mockResolvedValueOnce({
      data: { data: { accessToken: "tok", user: { id: "u1", email: "a@b.com", role: "seeker", isProfileComplete: true, basicInfo: {} } } },
    });

    let ctxValue;
    renderProvider(
      <AuthContext.Consumer>{(v) => { ctxValue = v; return null; }}</AuthContext.Consumer>
    );
    await waitFor(() => expect(ctxValue.user.token).toBe("tok"));
    expect(ctxValue.isAuthenticated).toBe(true);
  });
});
