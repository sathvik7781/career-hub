import React, { useState, useEffect } from "react";
import { Briefcase, Pencil, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../../../api/apiCheck";
import SectionCard from "../../../../components/SectionCard";
import {
  Input,
  Button,
  TextArea,
} from "../../../../components/UI/FormElements";

export default function ProfessionalForm({ profile, refreshProfile }) {
  const professional = profile?.professional || {};
  const experiences = profile?.experience || [];

  const emptyProfessional = {
    headline: "",
    careerLevel: "",
    summary: "",
    noExperience: false,
  };

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [loadingHeader, setLoadingHeader] = useState(false);
  const [professionalData, setProfessionalData] = useState(
    professional || emptyProfessional,
  );

  useEffect(() => {
    setProfessionalData(professional || emptyProfessional);
  }, [profile]);

  const handleHeaderChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...professionalData,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "careerLevel" && value === "Fresher") {
      updated.noExperience = true;
    }

    setProfessionalData(updated);
  };

  const handleHeaderSave = async () => {
    if (!professionalData.headline || !professionalData.summary) {
      toast.error("Headline and Summary are required");
      return;
    }

    setLoadingHeader(true);
    try {
      await API.put("/profile/professional", professionalData);
      toast.success("Professional section updated");
      refreshProfile();
      setIsEditingHeader(false);
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoadingHeader(false);
    }
  };

  const emptyExperience = {
    companyName: "",
    jobTitle: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  };

  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [expForm, setExpForm] = useState(emptyExperience);
  const [loadingExp, setLoadingExp] = useState(false);

  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "currentlyWorking" && checked) {
      setExpForm({ ...expForm, currentlyWorking: true, endDate: "" });
      return;
    }

    setExpForm({
      ...expForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddExp = () => {
    setExpForm(emptyExperience);
    setEditingExpIndex(null);
    setIsExpFormOpen(true);
  };

  const openEditExp = (index) => {
    const exp = experiences[index];
    setExpForm({
      ...exp,
      startDate: exp.startDate?.slice(0, 7),
      endDate: exp.endDate?.slice(0, 7),
    });
    setEditingExpIndex(index);
    setIsExpFormOpen(true);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();

    if (!expForm.companyName || !expForm.jobTitle || !expForm.startDate) {
      toast.error("Required fields missing");
      return;
    }

    setLoadingExp(true);

    try {
      if (editingExpIndex !== null) {
        const id = experiences[editingExpIndex]._id;
        await API.put(`/profile/experience/${id}`, expForm);
        toast.success("Experience updated");
      } else {
        await API.post("/profile/experience", expForm);
        toast.success("Experience added");
      }

      setIsExpFormOpen(false);
      setExpForm(emptyExperience);
      refreshProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally {
      setLoadingExp(false);
    }
  };

  const handleDeleteExp = async (index) => {
    const id = experiences[index]._id;

    try {
      await API.delete(`/profile/experience/${id}`);
      toast.success("Experience deleted");
      refreshProfile();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <SectionCard
      title="Professional"
      description="Showcase your career journey."
      icon={Briefcase}
      isComplete={professional?.headline && professional?.summary}
    >
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        {!isEditingHeader ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              {professional?.headline || "No headline added"}
            </h3>

            {professional?.careerLevel && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {professional.careerLevel}
              </p>
            )}

            <p className="text-sm text-secondary whitespace-pre-line">
              {professional?.summary || "No summary added yet."}
            </p>

            <button
              onClick={() => setIsEditingHeader(true)}
              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <Pencil size={16} /> Edit
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-app"
          >
            <Input
              label="Headline *"
              name="headline"
              value={professionalData.headline}
              onChange={handleHeaderChange}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-secondary">
                Career Level
              </label>
              <select
                name="careerLevel"
                value={professionalData.careerLevel}
                onChange={handleHeaderChange}
                className="input-field"
              >
                <option value="">Select Career Level</option>
                <option>Fresher</option>
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <div>
              <TextArea
                label="Summary"
                name="summary"
                maxLength={500}
                value={professionalData.summary}
                onChange={handleHeaderChange}
                placeholder="Write a short professional summary..."
                className="h-28"
              />
              <div className="text-right text-xs text-secondary mt-1">
                {professionalData.summary?.length || 0}/500
              </div>
            </div>

            {professionalData.careerLevel !== "Fresher" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="noExperience"
                  checked={professionalData.noExperience}
                  onChange={handleHeaderChange}
                  className="rounded border-border dark:border-slate-600"
                />
                <label className="text-sm text-secondary">
                  I don't have professional experience
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditingHeader(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleHeaderSave}
                isLoading={loadingHeader}
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ================= EXPERIENCE ================= */}

      {!professional?.noExperience && (
        <>
          {!isExpFormOpen && (
            <div className="flex justify-end mb-4">
              <Button onClick={openAddExp} variant="primary">
                <Plus size={16} /> Add Experience
              </Button>
            </div>
          )}

          {/* Experience Form */}
          <AnimatePresence>
            {isExpFormOpen && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleExpSubmit}
                className="space-y-4 border border-app rounded-xl p-6 bg-gray-50 dark:bg-slate-800/50 mb-6"
              >
                <Input
                  label="Company *"
                  name="companyName"
                  value={expForm.companyName}
                  onChange={handleExpChange}
                />
                <Input
                  label="Job Title *"
                  name="jobTitle"
                  value={expForm.jobTitle}
                  onChange={handleExpChange}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-secondary">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={expForm.employmentType}
                    onChange={handleExpChange}
                    className="input-field"
                  >
                    <option value="">Select Employment Type</option>
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Freelance</option>
                    <option>Part-time</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="month"
                    label="Start Date *"
                    name="startDate"
                    value={expForm.startDate}
                    onChange={handleExpChange}
                  />

                  {!expForm.currentlyWorking && (
                    <Input
                      type="month"
                      label="End Date"
                      name="endDate"
                      value={expForm.endDate}
                      onChange={handleExpChange}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={expForm.currentlyWorking}
                    onChange={handleExpChange}
                  />
                  <label className="text-sm text-secondary">
                    I currently work here
                  </label>
                </div>

                <TextArea
                  label="Description"
                  name="description"
                  value={expForm.description}
                  onChange={handleExpChange}
                  placeholder="Describe your responsibilities..."
                  className="h-24"
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsExpFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loadingExp}
                  >
                    Save
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Experience Cards */}
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-app rounded-xl p-5 bg-surface"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-primary">
                      {exp.jobTitle}
                    </h4>
                    <p className="text-sm text-secondary">{exp.companyName}</p>
                    <p className="text-xs text-secondary">
                      {exp.startDate?.slice(0, 7)} –{" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : exp.endDate?.slice(0, 7)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditExp(index)}
                      className="text-secondary hover:text-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExp(index)}
                      className="text-secondary hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}
