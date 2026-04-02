import { useSavedJobs, useUnsaveJob } from "../../profile/hooks/useSavedJobs";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Building2, Loader2, BookmarkX, Bookmark } from "lucide-react";

export default function SavedJobsPage() {
  const { data: savedJobs, isLoading } = useSavedJobs();
  const { mutate: unsaveJob, isPending: unsaving } = useUnsaveJob();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <div className="mb-6">
        <h1 className="heading-lg text-primary">Saved Jobs</h1>
        <p className="text-secondary mt-1">Review the jobs you've saved for later.</p>
      </div>

      {!savedJobs || savedJobs.length === 0 ? (
        <div className="card p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-muted" />
          </div>
          <h2 className="heading-md text-primary mb-2">No saved jobs yet</h2>
          <p className="text-secondary text-sm max-w-sm mb-6">
            When you find a job you like, click the bookmark icon to save it here for later.
          </p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div key={job._id} className="card p-5 flex flex-col group relative">
              {/* Unsave button overlay */}
              <button
                disabled={unsaving}
                onClick={(e) => {
                  e.preventDefault();
                  unsaveJob(job._id);
                }}
                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 hover:text-red-600 text-secondary transition-colors rounded-full shadow-sm z-10"
                title="Remove from saved"
              >
                <BookmarkX className="w-4 h-4" />
              </button>

              <Link to={`/jobs/${job._id}`} className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-app shrink-0 overflow-hidden">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-muted" />
                    )}
                  </div>
                </div>

                <h3 className="heading-md group-hover:text-primary-600 transition-colors mb-1 text-primary line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-secondary mb-4">{job.company?.name}</p>

                <div className="mt-auto pt-4 border-t border-app flex flex-wrap gap-x-4 gap-y-2 text-xs text-secondary">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-muted" />
                    {job.salary?.min
                      ? `${(job.salary.min / 1000).toFixed(0)}k – ${(job.salary.max / 1000).toFixed(0)}k`
                      : "Not disclosed"}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
