import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobDetails } from "../../jobs/hooks/useJobs";
import { useApplyToJob } from "../../applications/hooks/useApplications";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "../../profile/hooks/useSavedJobs";
import { AuthContext } from "../../../context/AuthContext";
import {
  MapPin, Briefcase, Building2, Clock, CheckCircle, Loader2, ArrowLeft, Bookmark, TrendingUp,
} from "lucide-react";
import { Button } from "../../../components/UI/FormElements";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setShowApplyModal(true);
  };

  const { data: job, isLoading, error } = useJobDetails(id);
  const { mutateAsync: applyToJob, isPending: applying } = useApplyToJob();

  const { data: savedJobs } = useSavedJobs(isAuthenticated && user?.role === "seeker");
  const { mutate: saveJob, isPending: saving } = useSaveJob();
  const { mutate: unsaveJob, isPending: unsaving } = useUnsaveJob();

  const isSaved = savedJobs?.some(j => j._id === job?._id);

  useEffect(() => {
    if (error) navigate("/jobs");
  }, [error, navigate]);

  const handleApply = async () => {
    if (!job) return;
    try {
      await applyToJob({ jobId: job._id });
      setShowApplyModal(false);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  if (!job) return null;

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <ConfirmModal
        isOpen={showApplyModal}
        title="Confirm Application"
        message={`Apply to ${job.title} at ${job.company?.name}? Your saved resume will be submitted.`}
        confirmLabel={applying ? "Applying..." : "Apply Now"}
        variant="primary"
        onConfirm={handleApply}
        onCancel={() => setShowApplyModal(false)}
      />

      {/* Back */}
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="card p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-app shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="w-7 h-7 text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="heading-lg text-primary">{job.title}</h1>
                <p className="text-secondary text-sm mt-0.5">{job.company?.name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge-primary">{job.type}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-secondary bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-app flex gap-3">
              <Button
                onClick={handleApplyClick}
                disabled={applying}
                variant="primary"
                className="w-full sm:w-auto px-8"
              >
                {applying ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply Now"}
              </Button>

              {user?.role === "seeker" && (
                <Button
                  onClick={() => isSaved ? unsaveJob(job._id) : saveJob(job._id)}
                  disabled={saving || unsaving}
                  variant="secondary"
                  className="flex items-center justify-center sm:w-auto px-4 !bg-transparent border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  title={isSaved ? "Remove from saved" : "Save Job"}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? "fill-primary-600 text-primary-600" : "text-secondary"}`} />
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card p-5 md:p-6 space-y-6">
            <section>
              <h2 className="heading-md text-primary mb-3">Description</h2>
              <p className="text-secondary leading-relaxed whitespace-pre-wrap text-sm">{job.description}</p>
            </section>

            {job.responsibilities?.length > 0 && (
              <section>
                <h2 className="heading-md text-primary mb-3">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-secondary text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements?.length > 0 && (
              <section>
                <h2 className="heading-md text-primary mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-secondary text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="heading-md text-primary mb-4">Job Overview</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Type</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{job.type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Location</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{job.location}</p>
                </div>
              </div>

              {job.experienceLevel && job.experienceLevel !== "Any" && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">Experience</p>
                    <p className="text-sm text-primary font-medium mt-0.5">{job.experienceLevel}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Salary</p>
                  <p className="text-sm text-primary font-medium mt-0.5">
                    {job.salary?.min
                      ? `${(job.salary.min / 1000).toFixed(0)}k – ${(job.salary.max / 1000).toFixed(0)}k ${job.salary.currency || "INR"}`
                      : "Competitive"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Company card */}
          <div className="card p-5">
            <h3 className="heading-md text-primary mb-3">About Company</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-app shrink-0">
                <Building2 className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{job.company?.name}</p>
                {job.company?.location && (
                  <p className="text-xs text-secondary mt-0.5">{job.company.location}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleApplyClick}
            disabled={applying}
            variant="primary"
            className="w-full"
          >
            {applying ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
