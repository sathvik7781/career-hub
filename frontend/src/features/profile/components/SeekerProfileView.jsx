import { useState, useRef, useEffect } from "react";
import BasicInfoForm from "./forms/BasicInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalForm from "./forms/ProfessionalForm";
import SkillsForm from "./forms/SkillsForm";
import ResumeUpload from "./modals/ResumeUpload";
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

export default function SeekerProfileView() {
  const { data: profileData, isLoading, error } = useProfile();
  const profile = profileData?.profile;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("basic");
  const contentRef = useRef(null);
  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  const refreshProfile = () => {
    queryClient.invalidateQueries(["profile", "me"]);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeTab];
    if (activeButton && navRef.current) {
      const { offsetTop, offsetHeight } = activeButton;
      setIndicatorStyle({ top: offsetTop, height: offsetHeight });
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const percentage = profile?.completion?.percentage || 0;

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "education", label: "Education" },
    { id: "professional", label: "Professional" },
    { id: "skills", label: "Skills" },
    { id: "resume", label: "Resume" },
  ];

  const tabIcons = {
    basic: User,
    education: GraduationCap,
    professional: Briefcase,
    skills: Sparkles,
    resume: FileText,
  };

  return (
    <div className="w-full bg-app h-full overflow-y-auto page-container">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 section-spacing">
        <div>
          <h1 className="heading-xl text-primary">Profile Settings</h1>
          <p className="text-secondary mt-1">
            Manage your personal and professional information
          </p>
        </div>

        {/* Completion */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <div className="text-sm text-secondary">Completion</div>
          <div className="w-full sm:w-40 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-primary-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[260px_1fr] gap-6 md:gap-8">
        <MobileTabDropdown
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
        />

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <div className="card p-5 sticky top-6">
            <nav ref={navRef} className="flex flex-col gap-2 relative">
              <span
                className="absolute left-0 w-1 bg-primary-600 rounded-r-full transition-all duration-300"
                style={{
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                }}
              />

              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isCompleted =
                  profile?.completion?.completedSections?.includes(tab.id);
                const Icon = tabIcons[tab.id];

                return (
                  <button
                    key={tab.id}
                    ref={(el) => (buttonRefs.current[tab.id] = el)}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative group px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between
                      ${
                        isActive
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "text-secondary hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-3 pl-2">
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-muted group-hover:text-primary"
                        }`}
                      />
                      <span>{tab.label}</span>
                    </div>

                    {isCompleted && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={contentRef}
          key={activeTab}
          className="card p-8 animate-fadeIn transition-all duration-300"
        >
          {activeTab === "basic" && (
            <BasicInfoForm profile={profile} refreshProfile={refreshProfile} />
          )}
          {activeTab === "education" && (
            <EducationForm profile={profile} refreshProfile={refreshProfile} />
          )}
          {activeTab === "professional" && (
            <ProfessionalForm
              profile={profile}
              refreshProfile={refreshProfile}
            />
          )}
          {activeTab === "skills" && (
            <SkillsForm profile={profile} refreshProfile={refreshProfile} />
          )}
          {activeTab === "resume" && (
            <ResumeUpload profile={profile} refreshProfile={refreshProfile} />
          )}
        </div>
      </div>
    </div>
  );
}

function MobileTabDropdown({ tabs, activeTab, setActiveTab, profile }) {
  const [open, setOpen] = useState(false);

  const tabIcons = {
    basic: User,
    education: GraduationCap,
    professional: Briefcase,
    skills: Sparkles,
    resume: FileText,
  };

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label;

  return (
    <div className="md:hidden relative mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full card px-4 py-3 flex items-center justify-between hover:border-primary-500 transition-colors"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-primary">
          {(() => {
            const Icon = tabIcons[activeTab];
            return <Icon className="w-4 h-4 text-primary-600" />;
          })()}
          {activeLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute z-50 mt-2 w-full card overflow-hidden transition-all duration-300 ${
          open
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 border-transparent shadow-none"
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isCompleted = profile?.completion?.completedSections?.includes(
            tab.id,
          );

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-secondary hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-muted" />
                {tab.label}
              </span>
              {isCompleted && (
                <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
