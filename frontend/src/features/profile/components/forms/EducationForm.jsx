import React, { useState } from "react";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import API from "../../../../api/apiCheck";
import toast from "react-hot-toast";
import SectionCard from "../../../../components/SectionCard";
import { Input, Button } from "../../../../components/UI/FormElements";

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
          <Button onClick={openAddForm} variant="primary">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isFormOpen && educations.length === 0 && (
        <div className="border border-dashed border-app rounded-xl p-6 text-center text-sm text-secondary">
          No education added yet.
        </div>
      )}

      {/* Inline Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="border border-app rounded-xl p-6 mb-6 space-y-4 bg-gray-50 dark:bg-slate-800/50"
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
              className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-secondary">Currently Pursuing</label>
          </div>

          {/* Score Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-secondary">
                Score Type
              </label>
              <select
                name="scoreType"
                value={formData.scoreType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Score Type</option>
                <option value="cgpa">CGPA</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

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
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData(emptyForm);
                setEditingIndex(null);
                setIsFormOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={loading} variant="primary">
              Save
            </Button>
          </div>
        </form>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="border border-app rounded-xl p-5 bg-surface hover:shadow-sm transition text-primary"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold">{edu.degree}</h3>
                <p className="text-sm text-secondary">{edu.institution}</p>
                <p className="text-xs text-secondary mt-1">
                  {edu.startYear} – {edu.isPursuing ? "Present" : edu.endYear}
                </p>
                {edu.scoreType && edu.scoreValue && (
                  <p className="text-xs text-secondary">
                    {edu.scoreType.toUpperCase()}: {edu.scoreValue}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(index)}
                  className="text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-secondary hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
