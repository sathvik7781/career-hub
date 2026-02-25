import { useParams, useNavigate } from "react-router-dom";
import { useJobDetails } from "../../jobs/hooks/useJobs";
import { useApplyToJob } from "../../applications/hooks/useApplications";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/UI/FormElements";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useJobDetails(id);
  const job = data?.job;

  const { mutateAsync: applyToJob, isPending: applying } = useApplyToJob();

  if (error) {
    navigate("/jobs");
    return null;
  }

  const handleApply = async () => {
    if (!job) return;
    if (!window.confirm(`Apply to ${job.title} at ${job.company.name}?`))
      return;

    try {
      await applyToJob({ jobId: job._id });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (isLoading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );
  if (!job) return null;

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <div className="card overflow-hidden">
        <div className="bg-app p-8 border-b border-app flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-surface rounded-xl shadow-sm flex items-center justify-center border border-app text-muted">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="heading-ld text-primary">{job.title}</h1>
              <div className="text-secondary font-medium">
                {job.company.name}
              </div>
            </div>
          </div>
          <Button
            onClick={handleApply}
            disabled={applying}
            variant="primary"
            className="px-8 py-3 w-full md:w-auto"
          >
            {applying ? (
              <Loader2 className="animate-spin mx-auto w-5 h-5" />
            ) : (
              "Apply Now"
            )}
          </Button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-primary">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="heading-md mb-3 text-primary">Description</h3>
              <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            {job.responsibilities?.length > 0 && (
              <section>
                <h3 className="heading-md mb-3 text-primary">
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-secondary"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements?.length > 0 && (
              <section>
                <h3 className="heading-md mb-3 text-primary">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-secondary"
                    >
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-app p-6 rounded-xl space-y-4 border border-app">
              <h4 className="font-bold text-primary">Job Overview</h4>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider">
                    Type
                  </div>
                  <div className="text-secondary font-medium">{job.type}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider">
                    Location
                  </div>
                  <div className="text-secondary font-medium">
                    {job.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider">
                    Salary
                  </div>
                  <div className="text-secondary font-medium">
                    {job.salary?.min
                      ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency || "USD"}`
                      : "Competitive"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
