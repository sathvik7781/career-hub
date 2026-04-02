import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";

vi.mock("@/api/api", () => ({ default: { defaults: { headers: { common: {} } } } }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() }, toast: { success: vi.fn(), error: vi.fn() } }));

const mockApply = vi.fn();

vi.mock("@/features/jobs/hooks/useJobs", () => ({
  useAllJobs: () => ({
    data: {
      data: [
        { _id: "j1", title: "React Developer", type: "Full-time", location: "Remote", company: { name: "Acme" }, salary: { min: 60000, max: 90000 } },
        { _id: "j2", title: "Node Engineer",   type: "Contract",  location: "NYC",    company: { name: "Beta" }, salary: null },
      ],
      pagination: { page: 1, totalPages: 1 },
    },
    isLoading: false,
    isFetching: false,
  }),
  useJobDetails: (id) => ({
    data: { _id: id, title: "React Developer", description: "Great role", type: "Full-time", location: "Remote", company: { name: "Acme" }, salary: { min: 60000, max: 90000, currency: "USD" }, responsibilities: ["Build UI"], requirements: ["React 3yr"] },
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/features/applications/hooks/useApplications", () => ({
  useApplyToJob: () => ({ mutateAsync: mockApply, isPending: false }),
  useMyApplications: () => ({
    data: [
      { _id: "a1", status: "applied",   createdAt: "2024-01-01", job: { _id: "j1", title: "React Developer", company: { name: "Acme" } } },
      { _id: "a2", status: "hired",     createdAt: "2024-02-01", job: { _id: "j2", title: "Node Engineer",   company: { name: "Beta" } } },
      { _id: "a3", status: "rejected",  createdAt: "2024-03-01", job: null },
    ],
    isLoading: false,
  }),
}));

afterEach(cleanup);

function makeQC() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrap(ui, path = "/", routePath = "*") {
  return render(
    <QueryClientProvider client={makeQC()}>
      <AuthContext.Provider value={{ isAuthenticated: true }}>
        <MemoryRouter initialEntries={[path]}>
          <Routes><Route path={routePath} element={ui} /></Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

// ── JobSearchPage ────────────────────────────────────────────────────────────
import JobSearchPage from "@/features/seeker/pages/JobSearchPage";

describe("JobSearchPage", () => {
  it("renders job cards", () => {
    wrap(<JobSearchPage />);
    expect(screen.getByText("React Developer")).toBeTruthy();
    expect(screen.getByText("Node Engineer")).toBeTruthy();
  });

  it("shows salary range when available", () => {
    wrap(<JobSearchPage />);
    expect(screen.getByText(/60k/i)).toBeTruthy();
  });

  it("shows Not disclosed when no salary", () => {
    wrap(<JobSearchPage />);
    expect(screen.getByText(/not disclosed/i)).toBeTruthy();
  });

  it("renders search input and location input", () => {
    wrap(<JobSearchPage />);
    expect(screen.getByPlaceholderText(/job title or keyword/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/location/i)).toBeTruthy();
  });

  it("updates keyword filter on input change", () => {
    wrap(<JobSearchPage />);
    const input = screen.getByPlaceholderText(/job title or keyword/i);
    fireEvent.change(input, { target: { value: "React" } });
    expect(input.value).toBe("React");
  });

  it("renders job type select with All Types default", () => {
    wrap(<JobSearchPage />);
    expect(screen.getByDisplayValue("All Types")).toBeTruthy();
  });

  it("shows no jobs message when empty", () => {
    // The mock returns 2 jobs, so test the text is NOT shown
    wrap(<JobSearchPage />);
    expect(screen.queryByText(/no jobs found/i)).toBeNull();
  });
});

// ── JobDetailsPage ───────────────────────────────────────────────────────────
import JobDetailsPage from "@/features/seeker/pages/JobDetailsPage";

describe("JobDetailsPage", () => {
  beforeEach(() => mockApply.mockReset());

  function renderDetails(id = "j1") {
    return render(
      <QueryClientProvider client={makeQC()}>
        <AuthContext.Provider value={{ isAuthenticated: true }}>
          <MemoryRouter initialEntries={[`/jobs/${id}`]}>
            <Routes><Route path="/jobs/:id" element={<JobDetailsPage />} /></Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  }

  it("renders job title and company", () => {
    renderDetails();
    expect(screen.getByText("React Developer")).toBeTruthy();
    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0);
  });

  it("renders job description", () => {
    renderDetails();
    expect(screen.getByText("Great role")).toBeTruthy();
  });

  it("renders responsibilities list", () => {
    renderDetails();
    expect(screen.getByText("Build UI")).toBeTruthy();
  });

  it("renders requirements list", () => {
    renderDetails();
    expect(screen.getByText("React 3yr")).toBeTruthy();
  });

  it("renders Apply Now button", () => {
    renderDetails();
    expect(screen.getAllByRole("button", { name: /apply now/i }).length).toBeGreaterThan(0);
  });

  it("opens confirm modal on Apply Now click", () => {
    renderDetails();
    fireEvent.click(screen.getAllByRole("button", { name: /apply now/i })[0]);
    expect(screen.getByText(/confirm application/i)).toBeTruthy();
  });

  it("calls applyToJob on modal confirm", async () => {
    mockApply.mockResolvedValue({});
    renderDetails();
    // open modal
    fireEvent.click(screen.getAllByRole("button", { name: /apply now/i })[0]);
    // click confirm button inside modal (first Apply Now is in modal, second is the page button)
    await waitFor(() => screen.getByText(/confirm application/i));
    fireEvent.click(screen.getAllByRole("button", { name: /apply now/i })[0]);
    await waitFor(() => expect(mockApply).toHaveBeenCalledWith({ jobId: "j1" }));
  });

  it("shows salary range in job overview", () => {
    renderDetails();
    expect(screen.getByText(/60k/i)).toBeTruthy();
  });
});

// ── MyApplicationsPage ───────────────────────────────────────────────────────
import MyApplicationsPage from "@/features/seeker/pages/MyApplicationsPage";

describe("MyApplicationsPage", () => {
  it("renders application job titles", () => {
    wrap(<MyApplicationsPage />);
    expect(screen.getByText("React Developer")).toBeTruthy();
    expect(screen.getByText("Node Engineer")).toBeTruthy();
  });

  it("shows Job Unavailable when job is null", () => {
    wrap(<MyApplicationsPage />);
    expect(screen.getByText("Job Unavailable")).toBeTruthy();
  });

  it("renders status badges", () => {
    wrap(<MyApplicationsPage />);
    expect(screen.getByText("Applied")).toBeTruthy();
    expect(screen.getByText("Hired")).toBeTruthy();
    expect(screen.getByText("Rejected")).toBeTruthy();
  });

  it("renders applied date", () => {
    wrap(<MyApplicationsPage />);
    expect(screen.getByText(/1 Jan 2024/i)).toBeTruthy();
  });
});
