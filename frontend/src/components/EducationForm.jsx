import React, { useState } from "react";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import API from "../api/apiCheck";
import toast from "react-hot-toast";
import SectionCard from "./SectionCard";

export default function EducationForm({ profile, refreshProfile }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const educations = profile?.education || [];

  const emptyForm = {
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    isPursuing: false,
    scoreType: "",
    scoreValue: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "isPursuing" && checked) {
        return {
          ...prev,
          isPursuing: true,
          endYear: "",
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditingIndex(null);
    setIsFormOpen(true);
  };

  const openEditForm = (index) => {
    setFormData(educations[index]);
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const handleDelete = async (index) => {
    const updated = educations.filter((_, i) => i !== index);

    try {
      await API.delete(`/profile/education/${educations[index]._id}`);
      toast.success("Education deleted");
      refreshProfile();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.degree || !formData.institution || !formData.startYear) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const cleanedData = {
      ...formData,
      startYear: Number(formData.startYear),
      endYear: formData.isPursuing ? null : Number(formData.endYear),
      scoreValue: formData.scoreValue ? Number(formData.scoreValue) : undefined,
    };

    try {
      if (editingIndex !== null) {
        const educationId = educations[editingIndex]._id;

        await API.put(`/profile/education/${educationId}`, cleanedData);

        toast.success("Education updated");
      } else {
        await API.post("/profile/education", cleanedData);

        toast.success("Education added");
      }
      setFormData(emptyForm);
      setEditingIndex(null);
      setIsFormOpen(false);
      refreshProfile();
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Education"
      description="Add your academic background."
      icon={GraduationCap}
      isComplete={educations.length > 0}
    >
      {/* Add Button */}
      {!isFormOpen && (
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0060c4] text-white rounded-lg hover:bg-[#0050a8] transition"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isFormOpen && educations.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
          No education added yet.
        </div>
      )}

      {/* Inline Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 rounded-xl p-6 mb-6 space-y-4 bg-gray-50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Degree *"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
            />
            <Input
              label="Institution *"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
            />
            <Input
              label="Field of Study"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
            />
            <Input
              label="Start Year *"
              name="startYear"
              type="number"
              value={formData.startYear}
              onChange={handleChange}
            />
            {!formData.isPursuing && (
              <Input
                label="End Year"
                name="endYear"
                type="number"
                value={formData.endYear}
                onChange={handleChange}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPursuing"
              checked={formData.isPursuing}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-600">Currently Pursuing</label>
          </div>

          {/* Score Type */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="scoreType"
              value={formData.scoreType}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Score Type</option>
              <option value="cgpa">CGPA</option>
              <option value="percentage">Percentage</option>
            </select>

            {formData.scoreType && (
              <Input
                label={formData.scoreType === "cgpa" ? "CGPA" : "Percentage"}
                name="scoreValue"
                type="number"
                value={formData.scoreValue}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(emptyForm);
                setEditingIndex(null);
                setIsFormOpen(false);
              }}
              className="px-4 py-2 text-sm border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-[#0060c4] text-white rounded-lg hover:bg-[#0050a8]"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {edu.startYear} – {edu.isPursuing ? "Present" : edu.endYear}
                </p>
                {edu.scoreType && edu.scoreValue && (
                  <p className="text-xs text-gray-500">
                    {edu.scoreType.toUpperCase()}: {edu.scoreValue}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEditForm(index)}>
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs mb-1">{label}</label>}
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
