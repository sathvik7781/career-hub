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
  Input:    ({ label, name, value, onChange, type }) => <div><label htmlFor={name}>{label}</label><input id={name} type={type || "text"} name={name} value={value || ""} onChange={onChange} /></div>,
  Button:   ({ children, onClick, type, isLoading }) => <button type={type || "button"} onClick={onClick} disabled={isLoading}>{children}</button>,
  TextArea: ({ label, name, value, onChange })       => <div><label htmlFor={name}>{label}</label><textarea id={name} name={name} value={value || ""} onChange={onChange} /></div>,
}));

import API from "@/api/api";
import toast from "react-hot-toast";
import SkillsForm from "@/features/profile/components/forms/SkillsForm";

const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderForm = (profile = {}) => render(
  <QueryClientProvider client={makeQC()}>
    <AuthContext.Provider value={{ updateProfileComplete: vi.fn() }}>
      <SkillsForm profile={profile} refreshProfile={vi.fn()} />
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe("TC-40 Empty skills state", () => {
  it("shows empty message", () => {
    renderForm({ skills: [], projects: [] });
    expect(screen.getByText("No skills added yet.")).toBeInTheDocument();
  });
});

describe("TC-41 Add skill — empty name", () => {
  it("shows toast when skill name is blank", async () => {
    renderForm({ skills: [], projects: [] });
    fireEvent.click(screen.getByText("Add Skill"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Skill name required"));
  });
});

describe("TC-42 Add skill success", () => {
  it("calls POST with skill name", async () => {
    API.post.mockResolvedValue({});
    renderForm({ skills: [], projects: [] });
    fireEvent.click(screen.getByText("Add Skill"));
    fireEvent.change(screen.getByPlaceholderText("e.g. React, Node.js"), { target: { value: "React" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(API.post).toHaveBeenCalledWith("/profile/skills", { name: "React" }));
  });
});

describe("TC-43 Delete skill", () => {
  it("calls DELETE with skill id", async () => {
    API.delete.mockResolvedValue({});
    renderForm({ skills: [{ _id: "skill1", name: "React" }], projects: [] });
    // X button is inside the skill pill span
    const xBtn = screen.getByText("React").closest("div").querySelector("button");
    fireEvent.click(xBtn);
    await waitFor(() => expect(API.delete).toHaveBeenCalledWith("/profile/skills/skill1"));
  });
});

describe("TC-44 Add project — missing title", () => {
  it("shows toast when title is empty", async () => {
    renderForm({ skills: [], projects: [] });
    // "Add Project" button is inside the projects section header
    fireEvent.click(screen.getAllByRole("button", { name: /Add Project/i })[0]);
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Project title is required"));
  });
});

describe("TC-45 techStack parsing", () => {
  it("splits comma-separated techStack into array", async () => {
    API.post.mockResolvedValue({});
    renderForm({ skills: [], projects: [] });
    fireEvent.click(screen.getAllByRole("button", { name: /Add Project/i })[0]);
    fireEvent.change(document.querySelector("#title"),     { target: { name: "title",     value: "My App"                  } });
    fireEvent.change(document.querySelector("#techStack"), { target: { name: "techStack", value: "React, Node.js, MongoDB" } });
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() =>
      expect(API.post).toHaveBeenCalledWith("/profile/projects", expect.objectContaining({
        techStack: ["React", "Node.js", "MongoDB"],
      }))
    );
  });
});

describe("TC-47 Edit project pre-fills techStack", () => {
  it("joins techStack array into comma string", () => {
    const project = { _id: "p1", title: "App", techStack: ["React", "Node.js"], startDate: "2023-01-01", endDate: null, currentlyWorking: false, description: "", projectUrl: "", githubUrl: "" };
    renderForm({ skills: [], projects: [project] });
    // buttons: [0]=Add Skill, [1]=Add Project, [2]=pencil(project), [3]=trash(project)
    fireEvent.click(document.querySelectorAll("button")[2]);
    expect(document.querySelector("#techStack").value).toBe("React, Node.js");
  });
});

describe("TC-48 Delete project", () => {
  it("calls DELETE with project id", async () => {
    API.delete.mockResolvedValue({});
    const project = { _id: "proj1", title: "App", techStack: [], startDate: null, currentlyWorking: false };
    renderForm({ skills: [], projects: [project] });
    // buttons: [0]=Add Skill, [1]=Add Project, [2]=pencil, [3]=trash
    fireEvent.click(document.querySelectorAll("button")[3]);
    await waitFor(() => expect(API.delete).toHaveBeenCalledWith("/profile/projects/proj1"));
  });
});
