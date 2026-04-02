import { useState, useRef, useEffect } from "react";
import BasicInfoForm from "./forms/BasicInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalForm from "./forms/ProfessionalForm";
import SkillsForm from "./forms/SkillsForm";
import ResumeUpload from "./modals/ResumeUpload";
import { User, GraduationCap, Briefcase, Sparkles, FileText } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const TABS = [
  { id: "basic",        label: "Basic",        icon: User },
  { id: "education",    label: "Education",    icon: GraduationCap },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "skills",       label: "Skills",       icon: Sparkles },
  { id: "resume",       label: "Resume",       icon: FileText },
];

export default function SeekerProfileView() {
  const { data: profileData, isLoading, error } = useProfile();
  const profile = profileData?.profile;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic");
  const tabRefs = useRef({});
  const [pillStyle, setPillStyle] = useState(null);

  const refreshProfile = () => queryClient.invalidateQueries({ queryKey: ["profile", "me"] });

  // Animate pill to active tab
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-red-500">Failed to load profile.</p>
    </div>
  );

  const percentage = profile?.completion?.percentage || 0;
  const completedSections = profile?.completion?.completedSections || [];

  return (
    <div className="page-container section-spacing animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="heading-xl text-primary">My Profile</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your professional presence on CareerHub
          </p>
        </div>

        {/* Profile strength */}
        <div className="card p-4 w-full sm:w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary">Profile Strength</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {percentage < 100 ? "Complete your profile to unlock more jobs" : "Your profile is fully optimized!"}
          </p>
        </div>
      </div>

      {/* ── Segmented Tab Bar ── */}
      <div className="mb-6">
        <div className="inline-flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 relative w-full sm:w-auto overflow-x-auto">
          {/* Animated pill */}
          {pillStyle && (
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm transition-all duration-300 ease-in-out"
              style={{ left: pillStyle.left + 4, width: pillStyle.width - 8 }}
              aria-hidden="true"
            />
          )}

          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            const done = completedSections.includes(id);
            return (
              <button
                key={id}
                ref={(el) => (tabRefs.current[id] = el)}
                onClick={() => setActiveTab(id)}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                  whitespace-nowrap transition-colors duration-200 flex-shrink-0
                  ${active ? "text-blue-600 dark:text-blue-400" : "text-muted hover:text-secondary"}`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{label}</span>
                {done && (
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-blue-500" : "bg-emerald-500"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div key={activeTab} className="animate-fadeIn">
        {activeTab === "basic"        && <BasicInfoForm        profile={profile} />}
        {activeTab === "education"    && <EducationForm        profile={profile} />}
        {activeTab === "professional" && <ProfessionalForm     profile={profile} />}
        {activeTab === "skills"       && <SkillsForm           profile={profile} />}
        {activeTab === "resume"       && <ResumeUpload         profile={profile} />}
      </div>
    </div>
  );
}
