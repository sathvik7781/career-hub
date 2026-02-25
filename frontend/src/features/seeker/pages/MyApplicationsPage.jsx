import { useMyApplications } from "../../applications/hooks/useApplications";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function MyApplicationsPage() {
  const { data, isLoading } = useMyApplications();
  const applications = data?.applications || [];

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <h1 className="heading-xl mb-6 text-primary">My Applications</h1>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="card text-center py-10 text-secondary border-dashed">
            You haven't applied to any jobs yet.
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition group cursor-default"
            >
              <div>
                <Link to={`/jobs/${app.job?._id}`}>
                  <h3 className="heading-md text-primary group-hover:text-primary-600 transition">
                    {app.job?.title || "Job Unavailable"}
                  </h3>
                </Link>
                <p className="text-secondary">
                  {app.job?.company?.name || "Company Unavailable"}
                </p>
                <p className="text-xs text-muted mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <span
                  className={`badge-primary
                           ${
                             app.status === "hired"
                               ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                               : app.status === "rejected"
                                 ? "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
                                 : ""
                           }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
