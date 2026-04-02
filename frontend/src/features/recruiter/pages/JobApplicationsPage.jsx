import { useParams, useNavigate } from "react-router-dom";
import { useJobApplications, useUpdateApplicationStatus } from "../../applications/hooks/useApplications";
import { Loader2, Users, ArrowLeft, User, Calendar, FileText } from "lucide-react";

const STATUS_STYLES = {
  applied:    "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  screening:  "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  interview:  "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  offer:      "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  hired:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  rejected:   "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
};

const STATUS_OPTIONS = ["applied", "screening", "interview", "offer", "hired", "rejected"];

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useJobApplications(jobId);
  const applications = data || [];
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Recruiter</p>
        <h1 className="heading-xl text-primary">Applications</h1>
        <p className="text-sm text-secondary mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""} received</p>
      </div>

      {applications.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="heading-md text-primary mb-2">No applications yet</h3>
          <p className="text-secondary text-sm">Applications will appear here once candidates apply.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const name = [app.applicant?.basicInfo?.firstName, app.applicant?.basicInfo?.lastName]
              .filter(Boolean).join(" ") || "Unknown Candidate";
            const statusStyle = STATUS_STYLES[app.status] || STATUS_STYLES.applied;

            return (
              <div key={app._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-app">
                      <User className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">{name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-secondary">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {app.applicant?.basicInfo?.phone && (
                          <span className="text-xs text-secondary">{app.applicant.basicInfo.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus({ applicationId: app._id, status: e.target.value })}
                      className="input-field py-1.5 px-3 text-xs w-auto"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
