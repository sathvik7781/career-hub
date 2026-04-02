import { useRecruiterJobs, useDeleteJob } from "../../jobs/hooks/useJobs";
import { Link } from "react-router-dom";
import { Plus, Briefcase, Trash2, Edit, Users, Loader2, MapPin, Clock } from "lucide-react";
import { Button } from "../../../components/UI/FormElements";

const STATUS_STYLES = {
  active:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  closed:   "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border border-gray-200 dark:border-slate-700",
  archived: "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500 border border-gray-200 dark:border-slate-700",
};

export default function JobDashboardPage() {
  const { data, isLoading } = useRecruiterJobs();
  const jobs = data || [];
  const { mutate: deleteJob } = useDeleteJob();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    deleteJob(id);
  };

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Recruiter</p>
          <h1 className="heading-xl text-primary">My Jobs</h1>
          <p className="text-sm text-secondary mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <Link to="/recruiter/post-job">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="heading-md text-primary mb-2">No jobs posted yet</h3>
          <p className="text-secondary text-sm mb-6">Create your first job posting to attract talent.</p>
          <Link to="/recruiter/post-job">
            <Button variant="primary"><Plus className="w-4 h-4" /> Post a Job</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="card p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-secondary">
                        <Clock className="w-3 h-3" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-secondary">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[job.status] || STATUS_STYLES.closed}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applications`}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" /> Applications
                  </Link>
                  <Link
                    to={`/recruiter/edit-job/${job._id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
