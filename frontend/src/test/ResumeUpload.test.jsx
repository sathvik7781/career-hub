import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

afterEach(() => cleanup());

vi.mock("axios");
vi.mock("react-hot-toast", () => { const t = vi.fn(); t.success = vi.fn(); t.error = vi.fn(); return { default: t }; });
vi.mock("@/context/AuthContext", () => ({
  AuthContext: React.createContext({ updateProfileComplete: vi.fn() }),
}));

const { mockUploadResume, mockDeleteResume } = vi.hoisted(() => ({
  mockUploadResume: vi.fn(),
  mockDeleteResume: vi.fn(),
}));

vi.mock("@/features/profile/hooks/useUpdateProfile", () => ({
  useUploadResume: () => ({ mutateAsync: mockUploadResume, isPending: false }),
  useDeleteResume: () => ({ mutateAsync: mockDeleteResume, isPending: false }),
}));
vi.mock("@/components/layout/SectionCard", () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock("@/components/UI/FormElements", () => ({
  Button: ({ children, onClick, disabled, isLoading }) => <button onClick={onClick} disabled={disabled || isLoading}>{children}</button>,
}));

import toast from "react-hot-toast";
import ResumeUpload from "@/features/profile/components/modals/ResumeUpload";
import { AuthContext } from "@/context/AuthContext";

const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderUpload = (profile = {}) => render(
  <QueryClientProvider client={makeQC()}>
    <AuthContext.Provider value={{ updateProfileComplete: vi.fn() }}>
      <ResumeUpload profile={profile} refreshProfile={vi.fn()} />
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe("TC-49 No resume — upload zone shown", () => {
  it("shows upload zone", () => {
    renderUpload({ resumeUrl: null });
    expect(screen.getAllByText("Upload Resume").length).toBeGreaterThan(0);
    expect(screen.getByText("Choose File")).toBeInTheDocument();
  });
});

describe("TC-49b Upload button disabled until file selected", () => {
  it("upload button is disabled with no file", () => {
    renderUpload({ resumeUrl: null });
    const btn = screen.getAllByText("Upload Resume").find(el => el.tagName === "BUTTON");
    expect(btn).toBeDisabled();
  });
});

describe("TC-52 Has resume — action buttons", () => {
  it("shows Download, Replace, Delete", () => {
    renderUpload({ resumeUrl: "http://resume.pdf" });
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Replace")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});

describe("TC-53 Download opens new tab", () => {
  it("calls window.open with resume URL", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});
    renderUpload({ resumeUrl: "http://resume.pdf" });
    fireEvent.click(screen.getByText("Download"));
    expect(openSpy).toHaveBeenCalledWith("http://resume.pdf", "_blank");
    openSpy.mockRestore();
  });
});

describe("TC-51 Upload success", () => {
  it("calls uploadResume", async () => {
    mockUploadResume.mockResolvedValue({});
    renderUpload({ resumeUrl: null });
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(document.querySelector("input[type='file']"), { target: { files: [file] } });
    fireEvent.click(screen.getAllByText("Upload Resume").find(el => el.tagName === "BUTTON"));
    await waitFor(() => expect(mockUploadResume).toHaveBeenCalledWith(file));
  });
});

describe("TC-56 Delete confirm", () => {
  it("calls deleteResume on confirm", async () => {
    mockDeleteResume.mockResolvedValue({});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderUpload({ resumeUrl: "http://resume.pdf" });
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => expect(mockDeleteResume).toHaveBeenCalled());
  });
});

describe("TC-55 Delete cancel", () => {
  it("does not call deleteResume when cancelled", () => {
    mockDeleteResume.mockClear();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderUpload({ resumeUrl: "http://resume.pdf" });
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDeleteResume).not.toHaveBeenCalled();
  });
});
