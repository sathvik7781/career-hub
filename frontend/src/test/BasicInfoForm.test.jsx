import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

afterEach(() => cleanup());

vi.mock("axios");
vi.mock("react-hot-toast", () => { const t = vi.fn(); t.success = vi.fn(); t.error = vi.fn(); return { default: t }; });

vi.mock("@/api/api", () => ({ default: { post: vi.fn(), delete: vi.fn() } }));
vi.mock("@/features/profile/components/modals/AvatarUploadModal", () => ({
  default: ({ open }) => open ? <div>AvatarModal</div> : null,
}));
vi.mock("@/components/common/ConfirmModal", () => ({
  default: ({ isOpen, onConfirm, onCancel, title }) =>
    isOpen ? <div><span>{title}</span><button onClick={onConfirm}>ConfirmBtn</button><button onClick={onCancel}>CancelBtn</button></div> : null,
}));
vi.mock("@/components/layout/SectionCard", () => ({
  default: ({ children, onEdit, onCancel, onSave, isEditing }) => (
    <div>
      {!isEditing && <button onClick={onEdit}>Edit</button>}
      {isEditing  && <button onClick={onCancel}>Cancel</button>}
      {isEditing  && <button onClick={onSave}>Save</button>}
      {children}
    </div>
  ),
}));
vi.mock("@/components/UI/InputField", () => ({
  default: ({ label, name, value, onChange, error }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={value || ""} onChange={onChange} />
      {error && <span>{error}</span>}
    </div>
  ),
}));
vi.mock("@/components/UI/InfoRow", () => ({ default: ({ label, value }) => <div>{label}: {value}</div> }));
vi.mock("@/context/AuthContext", () => ({
  AuthContext: React.createContext({ updateProfileImage: vi.fn() }),
}));

import API from "@/api/api";
import toast from "react-hot-toast";
import BasicInfoForm from "@/features/profile/components/forms/BasicInfoForm";
import { AuthContext } from "@/context/AuthContext";

const mockUpdateProfileImage = vi.fn();
const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderForm = (profile = baseProfile) =>
  render(
    <QueryClientProvider client={makeQC()}>
      <AuthContext.Provider value={{ updateProfileImage: mockUpdateProfileImage, updateProfileComplete: vi.fn() }}>
        <MemoryRouter><BasicInfoForm profile={profile} refreshProfile={vi.fn()} /></MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );

const baseProfile = {
  basicInfo: { firstName: "John", lastName: "Doe", phone: "1234567890", gender: "Male", age: 25, city: "Hyderabad", state: "Telangana", country: "India", profileImageUrl: null },
  completion: { completedSections: ["basic"], percentage: 20 },
};

describe("TC-09 View mode — with data", () => {
  it("displays info rows", () => {
    renderForm();
    expect(screen.getByText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByText(/Gender Identity/)).toBeInTheDocument();
    expect(screen.getByText(/Current Age/)).toBeInTheDocument();
    expect(screen.getByText(/Home City/)).toBeInTheDocument();
  });
});

describe("TC-10 No profile image — initials", () => {
  it("shows initials JD", () => {
    renderForm();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

describe("TC-11 Both names missing — shows U", () => {
  it("shows U as fallback", () => {
    renderForm({ ...baseProfile, basicInfo: { ...baseProfile.basicInfo, firstName: undefined, lastName: undefined } });
    expect(screen.getByText("U")).toBeInTheDocument();
  });
});

describe("TC-13 Trash hidden when no photo", () => {
  it("does not render trash button", () => {
    renderForm();
    expect(screen.queryByTitle("Remove Photo")).not.toBeInTheDocument();
  });
});

describe("TC-14 Click pencil → AvatarModal opens", () => {
  it("opens avatar modal", () => {
    renderForm();
    fireEvent.click(screen.getByTitle("Update Photo"));
    expect(screen.getByText("AvatarModal")).toBeInTheDocument();
  });
});

describe("TC-15 Click trash → ConfirmModal opens", () => {
  it("opens confirm modal", () => {
    renderForm({ ...baseProfile, basicInfo: { ...baseProfile.basicInfo, profileImageUrl: "http://img.jpg" } });
    fireEvent.click(screen.getByTitle("Remove Photo"));
    expect(screen.getByText("Remove Profile Photo?")).toBeInTheDocument();
  });
});

describe("TC-16 Confirm delete photo", () => {
  it("calls DELETE API", async () => {
    API.delete.mockResolvedValue({});
    renderForm({ ...baseProfile, basicInfo: { ...baseProfile.basicInfo, profileImageUrl: "http://img.jpg" } });
    fireEvent.click(screen.getByTitle("Remove Photo"));
    fireEvent.click(screen.getByText("ConfirmBtn"));
    await waitFor(() => expect(API.delete).toHaveBeenCalledWith("/profile/remove-avatar"));
  });
});

describe("TC-17 Cancel delete photo", () => {
  it("closes modal without API call", () => {
    API.delete.mockClear();
    renderForm({ ...baseProfile, basicInfo: { ...baseProfile.basicInfo, profileImageUrl: "http://img.jpg" } });
    fireEvent.click(screen.getByTitle("Remove Photo"));
    fireEvent.click(screen.getByText("CancelBtn"));
    expect(API.delete).not.toHaveBeenCalled();
    expect(screen.queryByText("Remove Profile Photo?")).not.toBeInTheDocument();
  });
});

describe("TC-18 Edit mode", () => {
  it("shows inputs on Edit click", () => {
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });
});

describe("TC-19 Field change updates formData", () => {
  it("updates value on input change", () => {
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("John"), { target: { name: "firstName", value: "Jane" } });
    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
  });
});

describe("TC-20 Cancel edit resets form", () => {
  it("restores original value on cancel", () => {
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("John"), { target: { name: "firstName", value: "Changed" } });
    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });
});

describe("TC-21 Save success", () => {
  it("calls POST and closes edit mode", async () => {
    API.post.mockResolvedValue({});
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(API.post).toHaveBeenCalledWith("/profile/basic-info", expect.any(Object)));
  });
});

describe("TC-22 Backend validation errors", () => {
  it("sets field errors from API response", async () => {
    API.post.mockRejectedValue({ response: { data: { errors: [{ path: "basicInfo.firstName", msg: "First name required" }] } } });
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(screen.getByText("First name required")).toBeInTheDocument());
  });
});

describe("TC-23 Generic save error", () => {
  it("shows generic error toast", async () => {
    API.post.mockRejectedValue({ response: { data: {} } });
    renderForm();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Action failed"));
  });
});
