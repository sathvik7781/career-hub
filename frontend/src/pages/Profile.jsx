import { useEffect, useState, useContext, useRef } from "react";
import API from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";
import BasicInfoForm from "../components/BasicInfoForm";
import EducationForm from "../components/EducationForm";
import ProfessionalForm from "../components/ProfessionalForm";
import SkillsForm from "../components/SkillsForm";
import ResumeUpload from "../components/ResumeUpload";
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  FileText,
  ChevronDown,
} from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const contentRef = useRef(null);
  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 0,
  });

  const fetchProfile = async () => {
    if (!user?.token) return;

    try {
      const res = await API.get("/profile/me");

      setProfile(res.data.profile);

      setUser((prev) => ({
        ...prev,
        isProfileComplete: res.data.isProfileComplete,
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProfile();
    }
  }, [user?.token]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeTab];

    if (activeButton && navRef.current) {
      const { offsetTop, offsetHeight } = activeButton;

      setIndicatorStyle({
        top: offsetTop,
        height: offsetHeight,
      });
    }
  }, [activeTab]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 border-2 border-[#0060c4] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal and professional information
            </p>
          </div>

          {/* Completion */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="text-sm text-gray-600">Completion</div>

            <div className="w-full sm:w-40 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-[#0060c4] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <span className="text-sm font-semibold text-gray-800">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Layout */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-[260px_1fr] gap-6 md:gap-8">
          {/* 📱 Mobile Tab Selector */}
          <MobileTabDropdown
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profile={profile}
          />

          {/* 💻 Desktop Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-6">
              <nav ref={navRef} className="flex flex-col gap-2 relative">
                {/* Sliding Indicator */}
                <span
                  className="absolute left-0 w-1 bg-[#0060c4] rounded-r-full transition-all duration-300"
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
                      className={`relative group px-4 py-3 rounded-xl text-sm font-medium 
              transition-all duration-300 flex items-center justify-between
              transform
              ${
                isActive
                  ? "bg-[#0060c4]/10 text-[#0060c4]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
                    >
                      <div className="flex items-center gap-3 pl-2">
                        <Icon
                          className={`w-4 h-4 transition-all duration-300
                  ${
                    isActive
                      ? "text-[#0060c4]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                        />
                        <span>{tab.label}</span>
                      </div>

                      {isCompleted && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
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
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 
             animate-fadeIn transition-all duration-300"
          >
            {activeTab === "basic" && (
              <BasicInfoForm profile={profile} refreshProfile={fetchProfile} />
            )}

            {activeTab === "education" && (
              <EducationForm profile={profile} refreshProfile={fetchProfile} />
            )}

            {activeTab === "professional" && (
              <ProfessionalForm
                profile={profile}
                refreshProfile={fetchProfile}
              />
            )}

            {activeTab === "skills" && (
              <SkillsForm profile={profile} refreshProfile={fetchProfile} />
            )}

            {activeTab === "resume" && (
              <ResumeUpload profile={profile} refreshProfile={fetchProfile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

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
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center justify-between transition hover:border-[#0060c4]"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
          {(() => {
            const Icon = tabIcons[activeTab];
            return <Icon className="w-4 h-4 text-[#0060c4]" />;
          })()}
          {activeLabel}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400" />
                {tab.label}
              </span>

              {isCompleted && (
                <span className="text-green-600 text-xs font-semibold">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
