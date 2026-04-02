import React, { useState } from "react";
import { Plus, X, Sparkles, Pencil, Trash2, Folder } from "lucide-react";
import toast from "react-hot-toast";
import SectionCard from "../../../../components/layout/SectionCard";
import { Input, Button, TextArea } from "../../../../components/UI/FormElements";
import { useAddSkill, useDeleteSkill, useAddProject, useUpdateProject, useDeleteProject } from "../../hooks/useUpdateProfile";

export default function SkillsForm({ profile }) {
  const skills = profile?.skills || [];
  const projects = profile?.projects || [];

  const [isAdding, setIsAdding] = useState(false);
  const [skillName, setSkillName] = useState("");

  const { mutateAsync: addSkill, isPending: loadingSkill } = useAddSkill();
  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutateAsync: addProject, isPending: addingProject } = useAddProject();
  const { mutateAsync: updateProject, isPending: updatingProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  const loadingProject = addingProject || updatingProject;

  const handleAddSkill = async () => {
    if (!skillName.trim()) { toast.error("Skill name required"); return; }
    try {
      await addSkill(skillName.trim());
      setSkillName("");
      setIsAdding(false);
    } catch {}
  };

  const handleDeleteSkill = (id) => deleteSkill(id);

  // PROJECTS STATE

  const emptyProject = { title: "", description: "", techStack: "", projectUrl: "", githubUrl: "", startDate: "", endDate: "", currentlyWorking: false };

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);

  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "currentlyWorking" && checked) {
      setProjectForm({ ...projectForm, currentlyWorking: true, endDate: "" });
      return;
    }

    setProjectForm({
      ...projectForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddProject = () => {
    setProjectForm(emptyProject);
    setEditingProjectIndex(null);
    setIsProjectFormOpen(true);
  };

  const openEditProject = (index) => {
    const project = projects[index];

    setProjectForm({
      ...project,
      techStack: project.techStack?.join(", ") || "",
      startDate: project.startDate?.slice(0, 7),
      endDate: project.endDate?.slice(0, 7),
    });

    setEditingProjectIndex(index);
    setIsProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title) { toast.error("Project title is required"); return; }
    const cleanedData = { ...projectForm, techStack: projectForm.techStack ? projectForm.techStack.split(",").map((t) => t.trim()) : [] };
    try {
      if (editingProjectIndex !== null) await updateProject({ id: projects[editingProjectIndex]._id, data: cleanedData });
      else await addProject(cleanedData);
      setIsProjectFormOpen(false);
      setProjectForm(emptyProject);
    } catch {}
  };

  const handleDeleteProject = (index) => deleteProject(projects[index]._id);

  return (
    <SectionCard
      title="Skills"
      description="Add your technical skills and projects."
      icon={Sparkles}
      isComplete={skills.length > 0 || projects.length > 0}
    >
      {/* ================= SKILLS ================= */}
      {!isAdding && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsAdding(true)} variant="primary">
            <Plus size={16} />
            Add Skill
          </Button>
        </div>
      )}
      {/* Empty State */}{" "}
      {skills.length === 0 && !isAdding && (
        <div className="border border-dashed border-app rounded-xl p-6 text-center text-sm text-secondary">
          {" "}
          No skills added yet.{" "}
        </div>
      )}
      {isAdding && (
        <div className="flex gap-3 mb-6 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-app">
          <input
            type="text"
            placeholder="e.g. React, Node.js"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="flex-1 input-field"
            autoFocus
          />

          <Button
            onClick={handleAddSkill}
            variant="primary"
            isLoading={loadingSkill}
          >
            Save
          </Button>

          <Button
            onClick={() => {
              setIsAdding(false);
              setSkillName("");
            }}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-3 mb-10">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded-full text-sm"
          >
            {skill.name}
            <button
              onClick={() => handleDeleteSkill(skill._id)}
              className="text-blue-400 hover:text-red-500 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {/* ================= PROJECTS ================= */}
      <div className="border-t border-app pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
            <Folder size={16} /> Projects
          </h3>

          {!isProjectFormOpen && (
            <Button onClick={openAddProject} variant="primary">
              <Plus size={16} />
              Add Project
            </Button>
          )}
        </div>

        {isProjectFormOpen && (
          <form
            onSubmit={handleProjectSubmit}
            className="space-y-4 border border-app rounded-xl p-6 bg-gray-50 dark:bg-slate-800/50 mb-6"
          >
            <Input
              label="Project Title *"
              name="title"
              value={projectForm.title}
              onChange={handleProjectChange}
            />

            <Input
              label="Tech Stack (comma separated)"
              name="techStack"
              value={projectForm.techStack}
              onChange={handleProjectChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="month"
                label="Start Date"
                name="startDate"
                value={projectForm.startDate}
                onChange={handleProjectChange}
              />

              {!projectForm.currentlyWorking && (
                <Input
                  type="month"
                  label="End Date"
                  name="endDate"
                  value={projectForm.endDate}
                  onChange={handleProjectChange}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={projectForm.currentlyWorking}
                onChange={handleProjectChange}
                className="rounded border-gray-300 dark:border-slate-600 focus:ring-blue-500"
              />
              <label className="text-sm text-secondary">
                Currently working on this
              </label>
            </div>

            <Input
              label="Live URL"
              name="projectUrl"
              value={projectForm.projectUrl}
              onChange={handleProjectChange}
            />

            <Input
              label="GitHub URL"
              name="githubUrl"
              value={projectForm.githubUrl}
              onChange={handleProjectChange}
            />

            <TextArea
              label="Description"
              name="description"
              value={projectForm.description}
              onChange={handleProjectChange}
              placeholder="Describe your project..."
              className="h-24"
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsProjectFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loadingProject}
              >
                Save
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="border border-app rounded-xl p-5 bg-surface text-primary"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{project.title}</h4>

                  {project.techStack?.length > 0 && (
                    <p className="text-xs text-secondary mt-1">
                      {project.techStack.join(", ")}
                    </p>
                  )}

                  {project.startDate && (
                    <p className="text-xs text-secondary mt-1">
                      {project.startDate?.slice(0, 7)} –{" "}
                      {project.currentlyWorking
                        ? "Present"
                        : project.endDate?.slice(0, 7)}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openEditProject(index)}
                    className="text-secondary hover:text-blue-600 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(index)}
                    className="text-secondary hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
