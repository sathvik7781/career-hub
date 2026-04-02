import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

afterEach(() => cleanup());

vi.mock("axios");
vi.mock("react-hot-toast", () => { const t = vi.fn(); t.success = vi.fn(); t.error = vi.fn(); return { default: t }; });

vi.mock("@/features/profile/hooks/useProfile", () => ({ useProfile: vi.fn() }));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock("@/features/profile/components/forms/BasicInfoForm",    () => ({ default: () => <div>BasicInfoForm</div> }));
vi.mock("@/features/profile/components/forms/EducationForm",    () => ({ default: () => <div>EducationForm</div> }));
vi.mock("@/features/profile/components/forms/ProfessionalForm", () => ({ default: () => <div>ProfessionalForm</div> }));
vi.mock("@/features/profile/components/forms/SkillsForm",       () => ({ default: () => <div>SkillsForm</div> }));
vi.mock("@/features/profile/components/modals/ResumeUpload",    () => ({ default: () => <div>ResumeUpload</div> }));

import { useProfile } from "@/features/profile/hooks/useProfile";
import SeekerProfileView from "@/features/profile/components/SeekerProfileView";

const renderView = () => render(<MemoryRouter><SeekerProfileView /></MemoryRouter>);
const mockProfile = (overrides = {}) => ({
  completion: { percentage: 60, completedSections: ["basic", "skills"] },
  basicInfo: { firstName: "John", lastName: "Doe" },
  ...overrides,
});

describe("TC-01 Loading state", () => {
  it("shows spinner when loading", () => {
    useProfile.mockReturnValue({ isLoading: true, error: null, data: null });
    renderView();
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });
});

describe("TC-02 Error state", () => {
  it("shows error message", () => {
    useProfile.mockReturnValue({ isLoading: false, error: new Error("fail"), data: null });
    renderView();
    expect(screen.getByText("Failed to load profile.")).toBeInTheDocument();
  });
});

describe("TC-03 Profile strength 0%", () => {
  it("shows 0% and incomplete text", () => {
    useProfile.mockReturnValue({ isLoading: false, error: null, data: { profile: mockProfile({ completion: { percentage: 0, completedSections: [] } }) } });
    renderView();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Complete your profile to unlock more jobs")).toBeInTheDocument();
  });
});

describe("TC-04 Profile strength 100%", () => {
  it("shows optimized text", () => {
    useProfile.mockReturnValue({ isLoading: false, error: null, data: { profile: mockProfile({ completion: { percentage: 100, completedSections: [] } }) } });
    renderView();
    expect(screen.getByText("Your profile is fully optimized!")).toBeInTheDocument();
  });
});

describe("TC-06 Tab switch", () => {
  beforeEach(() => {
    useProfile.mockReturnValue({ isLoading: false, error: null, data: { profile: mockProfile() } });
  });
  it("renders BasicInfoForm by default",  () => { renderView(); expect(screen.getByText("BasicInfoForm")).toBeInTheDocument(); });
  it("switches to EducationForm",         () => { renderView(); fireEvent.click(screen.getByText("Education"));    expect(screen.getByText("EducationForm")).toBeInTheDocument(); });
  it("switches to ProfessionalForm",      () => { renderView(); fireEvent.click(screen.getByText("Professional")); expect(screen.getByText("ProfessionalForm")).toBeInTheDocument(); });
  it("switches to SkillsForm",            () => { renderView(); fireEvent.click(screen.getByText("Skills"));       expect(screen.getByText("SkillsForm")).toBeInTheDocument(); });
  it("switches to ResumeUpload",          () => { renderView(); fireEvent.click(screen.getByText("Resume"));       expect(screen.getByText("ResumeUpload")).toBeInTheDocument(); });
});

describe("TC-07 Completed section dot", () => {
  it("renders dot on completed tab", () => {
    useProfile.mockReturnValue({ isLoading: false, error: null, data: { profile: mockProfile({ completion: { percentage: 40, completedSections: ["skills"] } }) } });
    renderView();
    expect(screen.getByText("Skills").closest("button").querySelector("span.rounded-full")).toBeTruthy();
  });
  it("does not render dot on incomplete tab", () => {
    useProfile.mockReturnValue({ isLoading: false, error: null, data: { profile: mockProfile({ completion: { percentage: 0, completedSections: [] } }) } });
    renderView();
    expect(screen.getByText("Education").closest("button").querySelector("span.rounded-full")).toBeNull();
  });
});
