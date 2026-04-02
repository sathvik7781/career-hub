import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

// ThemeContext is not exported — mock the hook instead
vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: mockToggleTheme }),
}));

vi.mock("@/api/api", () => ({ default: { defaults: { headers: { common: {} } } } }));

afterEach(cleanup);

const mockLogout = vi.fn();
const mockToggleTheme = vi.fn();
const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderNavbar({ user = null, isAuthenticated = false } = {}) {
  return render(
    <QueryClientProvider client={makeQC()}>
      <AuthContext.Provider value={{ user, logout: mockLogout, isAuthenticated }}>
        <MemoryRouter>
          <Navbar sidebarExpanded={false} onToggleSidebar={() => {}} />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

function renderSidebar({ role = "seeker", expanded = true, isMobile = false } = {}) {
  return render(
    <AuthContext.Provider value={{ user: { role }, logout: mockLogout }}>
      <MemoryRouter initialEntries={["/jobs"]}>
        <Sidebar expanded={expanded} onClose={() => {}} isMobile={isMobile} />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
describe("Navbar — unauthenticated", () => {
  it("shows Log in and Sign up links", () => {
    renderNavbar();
    expect(screen.getByText(/log in/i)).toBeTruthy();
    expect(screen.getByText(/sign up/i)).toBeTruthy();
  });

  it("does not show sidebar toggle when not authenticated", () => {
    renderNavbar();
    expect(screen.queryByLabelText(/toggle sidebar/i)).toBeNull();
  });
});

describe("Navbar — authenticated", () => {
  const user = { email: "jane@example.com", role: "seeker", profileImageUrl: null };

  it("shows sidebar toggle button", () => {
    renderNavbar({ user, isAuthenticated: true });
    expect(screen.getByLabelText(/toggle sidebar/i)).toBeTruthy();
  });

  it("shows username derived from email", () => {
    renderNavbar({ user, isAuthenticated: true });
    expect(screen.getByText("jane")).toBeTruthy();
  });

  it("shows the notification bell for authenticated users", () => {
    renderNavbar({ user, isAuthenticated: true });
    expect(screen.getByLabelText(/notifications/i)).toBeTruthy();
  });

  it("calls logout when the logout button is clicked", () => {
    mockLogout.mockReset();
    renderNavbar({ user, isAuthenticated: true });
    fireEvent.click(screen.getByText(/logout/i));
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it("shows theme toggle button", () => {
    renderNavbar({ user, isAuthenticated: true });
    expect(screen.getByLabelText(/toggle theme/i)).toBeTruthy();
  });

  it("calls toggleTheme on theme button click", () => {
    mockToggleTheme.mockReset();
    renderNavbar({ user, isAuthenticated: true });
    fireEvent.click(document.querySelector(".theme-switch__checkbox"));
    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});

// ── Sidebar ──────────────────────────────────────────────────────────────────
describe("Sidebar — seeker", () => {
  it("renders seeker nav items when expanded", () => {
    renderSidebar({ role: "seeker", expanded: true });
    expect(screen.getByText("Find Jobs")).toBeTruthy();
    expect(screen.getByText("My Applications")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
  });

  it("does not render labels when collapsed", () => {
    renderSidebar({ role: "seeker", expanded: false });
    expect(screen.queryByText("Find Jobs")).toBeNull();
  });

  it("active link has blue styling", () => {
    renderSidebar({ role: "seeker", expanded: true });
    const link = screen.getByText("Find Jobs").closest("a");
    expect(link.className).toContain("text-blue-600");
  });
});

describe("Sidebar — recruiter", () => {
  it("renders recruiter nav items", () => {
    renderSidebar({ role: "recruiter", expanded: true });
    expect(screen.getByText("My Jobs")).toBeTruthy();
    expect(screen.getByText("Post Job")).toBeTruthy();
    expect(screen.getByText("Company")).toBeTruthy();
  });
});

describe("Sidebar — mobile", () => {
  it("shows close button on mobile when expanded", () => {
    renderSidebar({ role: "seeker", expanded: true, isMobile: true });
    expect(screen.getByLabelText(/close sidebar/i)).toBeTruthy();
  });

  it("shows backdrop overlay on mobile when expanded", () => {
    renderSidebar({ role: "seeker", expanded: true, isMobile: true });
    expect(document.querySelector(".bg-black\\/40")).toBeTruthy();
  });

  it("calls logout from sidebar logout button", () => {
    mockLogout.mockReset();
    renderSidebar({ role: "seeker", expanded: true });
    fireEvent.click(screen.getByText("Logout").closest("button"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
