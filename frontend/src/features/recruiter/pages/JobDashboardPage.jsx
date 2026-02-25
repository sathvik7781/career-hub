import { useRecruiterJobs, useDeleteJob } from "../../jobs/hooks/useJobs";
import { Link } from "react-router-dom";
import { Plus, Briefcase, Trash2, Edit, Users, Loader2 } from "lucide-react";
import { Button } from "../../../components/UI/FormElements";

export default function JobDashboardPage() {
  const { data, isLoading } = useRecruiterJobs();
  const jobs = data?.jobs || [];

  const { mutate: deleteJob } = useDeleteJob();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    deleteJob(id);
  };

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <div className="flex justify-between items-center mb-8">
        <h1 className="heading-xl text-primary">My Jobs</h1>
        <Link to="/recruiter/post-job">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2 inline" /> Post New Job
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-20 border-dashed border-2">
          <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="heading-md text-primary mb-2">No jobs posted yet</h3>
          <p className="text-secondary mb-6">
            Create your first job posting to attract talent.
          </p>
          <Link
            to="/recruiter/post-job"
            className="text-primary-600 hover:underline font-medium"
          >
            Post a Job &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="heading-ld text-primary">{job.title}</h3>
                <div className="flex gap-4 text-sm text-secondary mt-1">
                  <span>{job.type}</span>
                  <span className="text-muted">•</span>
                  <span>{job.location}</span>
                  <span className="text-muted">•</span>
                  <span
                    className={`badge-primary ${job.status !== "active" && "opacity-60 grayscale"}`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <Link
                  to={`/recruiter/jobs/${job._id}/applications`}
                  className="flex items-center gap-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-3 py-1.5 rounded transition"
                >
                  <Users className="w-4 h-4" /> Applications
                </Link>
                <Link
                  to={`/recruiter/edit-job/${job._id}`}
                  className="flex items-center gap-1 text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded transition"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded transition font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
