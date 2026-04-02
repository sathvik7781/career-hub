import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useRecruiterJobs } from "../../jobs/hooks/useJobs";
import { useMyCompany } from "../../recruiter/hooks/useCompany";
import {
  Briefcase, Plus, Users, Building2, ArrowRight,
  CheckCircle, Clock, TrendingUp, Edit, BadgeCheck,
} from "lucide-react";

const STATUS_COLORS = {
  active:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  closed:   "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border-gray-200 dark:border-slate-700",
  archived: "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500 border-gray-200 dark:border-slate-700",
};

const COMPANY_STATUS = {
  approved:  { label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"         },
  rejected:  { label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"                 },
  suspended: { label: "Suspended", cls: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"     },
};

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const { data: jobsData } = useRecruiterJobs();
  const { data: company }  = useMyCompany();

  const jobs        = jobsData || [];
  const displayName = (user?.name || user?.email || "").split("@")[0];
  const activeJobs  = jobs.filter(j => j.status === "active").length;
  const closedJobs  = jobs.filter(j => j.status === "closed").length;
  const companyStatus = company ? COMPANY_STATUS[company.verificationStatus] || COMPANY_STATUS.pending : null;

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="heading-xl text-primary">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-secondary mt-1">Manage your jobs and track applications.</p>
        </div>
        <Link to="/recruiter/post-job">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Jobs",   value: jobs.length, icon: Briefcase,    color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20"       },
          { label: "Active Jobs",  value: activeJobs,  icon: TrendingUp,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Closed Jobs",  value: closedJobs,  icon: Clock,        color: "text-gray-500 dark:text-gray-400",    bg: "bg-gray-100 dark:bg-slate-800"        },
          { label: "Company",      value: company ? companyStatus?.label : "None", icon: Building2, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Jobs list */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-md text-primary">Your Jobs</h2>
            <Link to="/recruiter/jobs" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Manage all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-sm text-secondary">No jobs posted yet.</p>
              <Link to="/recruiter/post-job" className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">Post your first job →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 6).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{job.title}</p>
                      <p className="text-xs text-secondary">{job.type} · {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[job.status] || STATUS_COLORS.closed}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    <Link to={`/recruiter/jobs/${job._id}/applications`} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Users className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    </Link>
                    <Link to={`/recruiter/edit-job/${job._id}`} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <Edit className="w-3.5 h-3.5 text-secondary" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Company status */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Company</h2>
            {company ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{company.name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${companyStatus?.cls}`}>
                      <BadgeCheck className="w-3 h-3" /> {companyStatus?.label}
                    </span>
                  </div>
                </div>
                <Link to="/recruiter/company" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  <Edit className="w-3.5 h-3.5" /> Manage Company
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-secondary mb-3">No company registered yet.</p>
                <Link to="/recruiter/company" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Register Company
                </Link>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Post a Job",       to: "/recruiter/post-job", icon: Plus      },
                { label: "My Jobs",          to: "/recruiter/jobs",     icon: Briefcase },
                { label: "Company Profile",  to: "/recruiter/company",  icon: Building2 },
                { label: "My Profile",       to: "/profile",            icon: CheckCircle },
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
    </div>
  );
}
