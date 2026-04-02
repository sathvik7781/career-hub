import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCompanyById } from "../../recruiter/hooks/useCompany";
import { useAllJobs } from "../../jobs/hooks/useJobs";
import { Building2, MapPin, Globe, ArrowLeft, Briefcase, Clock, Loader2 } from "lucide-react";

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading: loadingCompany, error } = useCompanyById(id);
  const { data: jobsData, isLoading: loadingJobs } = useAllJobs({ company: id });
  const jobs = jobsData?.data || [];

  useEffect(() => {
    if (error) navigate("/companies");
  }, [error, navigate]);

  if (loadingCompany)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  if (!company) return null;

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Back */}
      <button
        onClick={() => navigate("/companies")}
        className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main */}
        <div className="lg:col-span-2 space-y-5">

          {/* Company header */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-app flex items-center justify-center shrink-0 overflow-hidden">
                {company.logo
                  ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  : <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="heading-lg text-primary">{company.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mt-1">
                  Verified Company
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                  {company.location && (
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-muted" /> {company.location}
                    </span>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                      <Globe className="w-3.5 h-3.5" /> {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {company.description && (
              <div className="mt-5 pt-5 border-t border-app">
                <h2 className="heading-md text-primary mb-2">About</h2>
                <p className="text-sm text-secondary leading-relaxed">{company.description}</p>
              </div>
            )}
          </div>

          {/* Open jobs */}
          <div className="card p-6">
            <h2 className="heading-md text-primary mb-4">
              Open Positions
              {!loadingJobs && (
                <span className="ml-2 text-sm font-normal text-secondary">({jobs.length})</span>
              )}
            </h2>

            {loadingJobs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-secondary w-6 h-6" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-sm text-secondary">No open positions right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link key={job._id} to={`/jobs/${job._id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-app hover:border-primary-300 dark:hover:border-primary-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group">
                    <div>
                      <p className="font-semibold text-sm text-primary group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-secondary">
                          <Clock className="w-3 h-3" /> {job.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-secondary">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </div>
                    </div>
                    <span className="badge-primary shrink-0">{job.type}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="heading-md text-primary mb-4">Company Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Company</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{company.name}</p>
                </div>
              </div>
              {company.location && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">Location</p>
                    <p className="text-sm text-primary font-medium mt-0.5">{company.location}</p>
                  </div>
                </div>
              )}
              {company.website && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">Website</p>
                    <a href={company.website} target="_blank" rel="noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-0.5 block">
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">Open Roles</p>
                  <p className="text-sm text-primary font-medium mt-0.5">{jobs.length} position{jobs.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
