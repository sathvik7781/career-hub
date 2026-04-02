import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

vi.mock("@/api/api", () => ({ default: { defaults: { headers: { common: {} } } } }));

afterEach(cleanup);

function renderWithAuth(user, loading = false, path = "/protected", allowedRoles) {
  return render(
    <AuthContext.Provider value={{ user, loading }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("ProtectedRoute", () => {
  it("shows spinner while loading", () => {
    renderWithAuth({ token: null }, true);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("redirects to /login when no token", () => {
    renderWithAuth({ token: null, role: null }, false);
    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("redirects to /dashboard when role not in allowedRoles", () => {
    renderWithAuth({ token: "abc", role: "seeker" }, false, "/protected", ["recruiter"]);
    expect(screen.getByText("Dashboard Page")).toBeTruthy();
  });

  it("renders outlet when authenticated and role matches", () => {
    renderWithAuth({ token: "abc", role: "seeker" }, false, "/protected", ["seeker"]);
    expect(screen.getByText("Protected Content")).toBeTruthy();
  });
});
