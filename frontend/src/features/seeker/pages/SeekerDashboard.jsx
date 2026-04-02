import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useMyApplications } from "../../applications/hooks/useApplications";
import { useAllJobs } from "../../jobs/hooks/useJobs";
import { useProfile } from "../../profile/hooks/useProfile";
import { useSavedJobs } from "../../profile/hooks/useSavedJobs";
import {
  Briefcase, Search, FileText, User, ArrowRight,
  TrendingUp, Clock, CheckCircle, XCircle, Building2, Bookmark,
} from "lucide-react";

const STATUS_COLORS = {
  applied:   "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  screening: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  interview: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  offer:     "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  hired:     "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  rejected:  "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border-gray-200 dark:border-slate-700",
};

export default function SeekerDashboard() {
  const { user } = useContext(AuthContext);
  const { data: apps } = useMyApplications();
  const { data: jobsData } = useAllJobs({ limit: 5 });
  const { data: profileData } = useProfile();
  const { data: savedJobs } = useSavedJobs();

  const applications = apps || [];
  const recentJobs   = jobsData?.data?.slice(0, 5) || [];
  const profile      = profileData?.profile;
  const completion   = profile?.completion?.percentage || 0;
  const displayName  = (user?.name || user?.email || "").split("@")[0];

  const stats = {
    total:     applications.length,
    active:    applications.filter(a => !["hired","rejected"].includes(a.status)).length,
    hired:     applications.filter(a => a.status === "hired").length,
    rejected:  applications.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="heading-xl text-primary">Welcome back, {displayName} 👋</h1>
        <p className="text-sm text-secondary mt-1">Here's what's happening with your job search.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Applied",  value: stats.total,    icon: FileText,    color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20",    link: "/my-applications" },
          { label: "In Progress",    value: stats.active,   icon: Clock,       color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20",  link: "/my-applications" },
          { label: "Hired",          value: stats.hired,    icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", link: "/my-applications" },
          { label: "Rejected",       value: stats.rejected, icon: XCircle,     color: "text-gray-500 dark:text-gray-400",    bg: "bg-gray-100 dark:bg-slate-800",     link: "/my-applications" },
          { label: "Saved Jobs",     value: savedJobs?.length || 0, icon: Bookmark, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20", link: "/saved-jobs" },
        ].map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className="card p-5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-md text-primary">Recent Applications</h2>
            <Link to="/my-applications" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-sm text-secondary">No applications yet.</p>
              <Link to="/jobs" className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">Browse jobs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{app.job?.title || "Job Unavailable"}</p>
                      <p className="text-xs text-secondary truncate">{app.job?.company?.name}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ml-2 ${STATUS_COLORS[app.status] || STATUS_COLORS.applied}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Profile completion */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Profile Strength</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-secondary">Completion</span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{completion}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <p className="text-xs text-secondary mb-3">
              {completion < 100 ? "Complete your profile to get more visibility." : "Your profile is fully optimized!"}
            </p>
            <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              <User className="w-3.5 h-3.5" /> Edit Profile
            </Link>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Find Jobs",         to: "/jobs",             icon: Search    },
                { label: "Saved Jobs",        to: "/saved-jobs",       icon: Bookmark  },
                { label: "My Applications",   to: "/my-applications",  icon: FileText  },
                { label: "Browse Companies",  to: "/companies",        icon: Building2 },
                { label: "Edit Profile",      to: "/profile",          icon: User      },
              ].map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-md text-primary">Latest Job Openings</h2>
          <Link to="/jobs" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            Browse all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentJobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="flex items-start gap-3 p-3 rounded-xl border border-app hover:border-primary-300 dark:hover:border-primary-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-app">
                <Briefcase className="w-4 h-4 text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary group-hover:text-primary-600 transition-colors truncate">{job.title}</p>
                <p className="text-xs text-secondary truncate">{job.company?.name}</p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 mt-1">{job.type}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
