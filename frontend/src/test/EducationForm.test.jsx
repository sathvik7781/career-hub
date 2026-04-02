import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";

afterEach(() => cleanup());

vi.mock("axios");
vi.mock("react-hot-toast", () => { const t = vi.fn(); t.success = vi.fn(); t.error = vi.fn(); return { default: t }; });
vi.mock("@/api/api", () => ({ default: { post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));
vi.mock("@/components/layout/SectionCard", () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock("@/components/UI/FormElements", () => ({
  Input:  ({ label, name, value, onChange }) => <div><label htmlFor={name}>{label}</label><input id={name} name={name} value={value || ""} onChange={onChange} /></div>,
  Button: ({ children, onClick, type })      => <button type={type || "button"} onClick={onClick}>{children}</button>,
}));

import API from "@/api/api";
import toast from "react-hot-toast";
import EducationForm from "@/features/profile/components/forms/EducationForm";

const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderForm = (profile = {}) => render(
  <QueryClientProvider client={makeQC()}>
    <AuthContext.Provider value={{ updateProfileComplete: vi.fn() }}>
      <EducationForm profile={profile} refreshProfile={vi.fn()} />
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe("TC-24 Empty state", () => {
  it("shows empty message", () => {
    renderForm({ education: [] });
    expect(screen.getByText("No education added yet.")).toBeInTheDocument();
  });
});

describe("TC-25 Required fields validation", () => {
  it("shows toast when required fields missing", async () => {
    renderForm({ education: [] });
    fireEvent.click(screen.getByText("Add Education"));
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Please fill all required fields"));
  });
});

describe("TC-26 Add Education success", () => {
  it("calls POST on valid submit", async () => {
    API.post.mockResolvedValue({});
    renderForm({ education: [] });
    fireEvent.click(screen.getByText("Add Education"));
    fireEvent.change(document.querySelector("#degree"),      { target: { name: "degree",      value: "B.Tech" } });
    fireEvent.change(document.querySelector("#institution"), { target: { name: "institution", value: "JNTU"   } });
    fireEvent.change(document.querySelector("#startYear"),   { target: { name: "startYear",   value: "2020"   } });
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(API.post).toHaveBeenCalledWith("/profile/education", expect.objectContaining({ degree: "B.Tech" })));
  });
});

describe("TC-27 isPursuing hides endYear", () => {
  it("hides end year field when checked", () => {
    renderForm({ education: [] });
    fireEvent.click(screen.getByText("Add Education"));
    fireEvent.click(document.querySelector("input[name='isPursuing']"));
    expect(document.querySelector("#endYear")).toBeNull();
  });
});

describe("TC-28 Edit pre-fills form", () => {
  it("opens form with existing data", () => {
    const edu = { _id: "1", degree: "B.Tech", institution: "JNTU", startYear: 2020, endYear: 2024, isPursuing: false, fieldOfStudy: "CSE", scoreType: "", scoreValue: "" };
    renderForm({ education: [edu] });
    // buttons: [0]=Add Education, [1]=pencil, [2]=trash
    fireEvent.click(document.querySelectorAll("button")[1]);
    expect(document.querySelector("#degree").value).toBe("B.Tech");
  });
});

describe("TC-29 Edit Education save", () => {
  it("calls PUT on edit save", async () => {
    API.put.mockResolvedValue({});
    const edu = { _id: "edu1", degree: "B.Tech", institution: "JNTU", startYear: 2020, endYear: 2024, isPursuing: false, fieldOfStudy: "", scoreType: "", scoreValue: "" };
    renderForm({ education: [edu] });
    fireEvent.click(document.querySelectorAll("button")[1]);
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(API.put).toHaveBeenCalledWith("/profile/education/edu1", expect.any(Object)));
  });
});

describe("TC-30 Delete Education", () => {
  it("calls DELETE on trash click", async () => {
    API.delete.mockResolvedValue({});
    const edu = { _id: "abc123", degree: "B.Tech", institution: "JNTU", startYear: 2020, endYear: 2024, isPursuing: false };
    renderForm({ education: [edu] });
    // buttons: [0]=Add Education, [1]=pencil, [2]=trash
    fireEvent.click(document.querySelectorAll("button")[2]);
    await waitFor(() => expect(API.delete).toHaveBeenCalledWith("/profile/education/abc123"));
  });
});
