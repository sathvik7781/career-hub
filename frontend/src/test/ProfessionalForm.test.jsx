import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";

afterEach(() => cleanup());

vi.mock("axios");
vi.mock("react-hot-toast", () => { const t = vi.fn(); t.success = vi.fn(); t.error = vi.fn(); return { default: t }; });
vi.mock("@/api/api", () => ({ default: { post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));
vi.mock("framer-motion", () => ({
  motion: {
    div:  ({ children, ...p }) => <div {...p}>{children}</div>,
    form: ({ children, onSubmit, ...p }) => <form onSubmit={onSubmit} {...p}>{children}</form>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
vi.mock("@/components/layout/SectionCard", () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock("@/components/UI/FormElements", () => ({
  Input:    ({ label, name, value, onChange, type }) => <div><label htmlFor={name}>{label}</label><input id={name} type={type || "text"} name={name} value={value || ""} onChange={onChange} /></div>,
  Button:   ({ children, onClick, type, isLoading }) => <button type={type || "button"} onClick={onClick} disabled={isLoading}>{children}</button>,
  TextArea: ({ label, name, value, onChange })       => <div><label htmlFor={name}>{label}</label><textarea id={name} name={name} value={value || ""} onChange={onChange} /></div>,
}));

import API from "@/api/api";
import toast from "react-hot-toast";
import ProfessionalForm from "@/features/profile/components/forms/ProfessionalForm";

const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderForm = (profile = {}) => render(
  <QueryClientProvider client={makeQC()}>
    <AuthContext.Provider value={{ updateProfileComplete: vi.fn() }}>
      <ProfessionalForm profile={profile} refreshProfile={vi.fn()} />
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe("TC-31 No headline", () => {
  it("shows fallback text", () => {
    renderForm({ professional: {}, experience: [] });
    expect(screen.getByText("No headline added")).toBeInTheDocument();
  });
});

describe("TC-32 Save header — missing fields", () => {
  it("shows toast when headline or summary missing", async () => {
    renderForm({ professional: {}, experience: [] });
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Headline and Summary are required"));
  });
});

describe("TC-33 Save header success", () => {
  it("calls PUT on valid save", async () => {
    API.put.mockResolvedValue({});
    renderForm({ professional: {}, experience: [] });
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(document.querySelector("#headline"), { target: { name: "headline", value: "Frontend Dev" } });
    fireEvent.change(document.querySelector("#summary"),  { target: { name: "summary",  value: "I build UIs"  } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(API.put).toHaveBeenCalledWith("/profile/professional", expect.objectContaining({ headline: "Frontend Dev" })));
  });
});

describe("TC-34 Fresher hides experience section", () => {
  it("does not show Add Experience when noExperience is true", () => {
    renderForm({ professional: { noExperience: true, headline: "Dev", summary: "Summary" }, experience: [] });
    expect(screen.queryByText("Add Experience")).not.toBeInTheDocument();
  });
});

describe("TC-35 Add Experience — missing fields", () => {
  it("shows toast on missing required fields", async () => {
    renderForm({ professional: { headline: "Dev", summary: "S" }, experience: [] });
    fireEvent.click(screen.getByText("Add Experience"));
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Required fields missing"));
  });
});

describe("TC-36 currentlyWorking hides endDate", () => {
  it("hides end date field", () => {
    renderForm({ professional: { headline: "Dev", summary: "S" }, experience: [] });
    fireEvent.click(screen.getByText("Add Experience"));
    fireEvent.click(document.querySelector("input[name='currentlyWorking']"));
    expect(document.querySelector("#endDate")).toBeNull();
  });
});

describe("TC-37 Add Experience success", () => {
  it("calls POST on valid form", async () => {
    API.post.mockResolvedValue({});
    renderForm({ professional: { headline: "Dev", summary: "S" }, experience: [] });
    fireEvent.click(screen.getByText("Add Experience"));
    fireEvent.change(document.querySelector("#companyName"), { target: { name: "companyName", value: "Google"  } });
    fireEvent.change(document.querySelector("#jobTitle"),    { target: { name: "jobTitle",    value: "SWE"     } });
    fireEvent.change(document.querySelector("#startDate"),   { target: { name: "startDate",   value: "2023-01" } });
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(API.post).toHaveBeenCalledWith("/profile/experience", expect.objectContaining({ companyName: "Google" })));
  });
});

describe("TC-38 Edit Experience save", () => {
  it("calls PUT on edit save", async () => {
    API.put.mockResolvedValue({});
    const exp = { _id: "exp1", jobTitle: "Dev", companyName: "Google", startDate: "2023-01-01", endDate: null, currentlyWorking: false, employmentType: "", location: "", description: "" };
    renderForm({ professional: { headline: "Dev", summary: "S" }, experience: [exp] });
    // buttons: [0]=Edit(header), [1]=Add Experience, [2]=pencil(exp), [3]=trash(exp)
    fireEvent.click(document.querySelectorAll("button")[2]);
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(API.put).toHaveBeenCalledWith("/profile/experience/exp1", expect.any(Object)));
  });
});

describe("TC-39 Delete Experience", () => {
  it("calls DELETE on trash click", async () => {
    API.delete.mockResolvedValue({});
    const exp = { _id: "exp1", jobTitle: "Dev", companyName: "Google", startDate: "2023-01-01", currentlyWorking: false };
    renderForm({ professional: { headline: "Dev", summary: "S" }, experience: [exp] });
    // buttons: [0]=Edit(header), [1]=Add Experience, [2]=pencil, [3]=trash
    fireEvent.click(document.querySelectorAll("button")[3]);
    await waitFor(() => expect(API.delete).toHaveBeenCalledWith("/profile/experience/exp1"));
  });
});
