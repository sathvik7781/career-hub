import { useState, useEffect, useContext } from "react";
import { useAllJobs } from "../../jobs/hooks/useJobs";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Briefcase, Building2, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, Bookmark } from "lucide-react";
import { Button } from "../../../components/UI/FormElements";
import { AuthContext } from "../../../context/AuthContext";
import { useSavedJobs, useSaveJob, useUnsaveJob } from "../../profile/hooks/useSavedJobs";
import Footer from "../../../components/layout/Footer";

export default function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ 
    keyword: searchParams.get("keyword") || "", 
    location: "", 
    type: "", 
    experienceLevel: "",
    minSalary: "",
    maxSalary: ""
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useAllJobs({ ...appliedFilters, page });
  const jobs = data?.data || [];
  const pagination = data?.pagination;

  const { data: savedJobs } = useSavedJobs(isAuthenticated && user?.role === "seeker");
  const { mutate: saveJob } = useSaveJob();
  const { mutate: unsaveJob } = useUnsaveJob();

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setAppliedFilters((f) => ({ ...f, keyword, location, type, experienceLevel, minSalary, maxSalary }));
    }, 500);
    return () => clearTimeout(t);
  }, [keyword, location, type, experienceLevel, minSalary, maxSalary]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  
  const handleExperienceChange = (e) => {
    setExperienceLevel(e.target.value);
  };

  return (
    <>
      <div className="page-container animate-fadeIn section-spacing">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 rounded-2xl p-6 md:p-10 mb-8 text-white shadow-lg">
        <h1 className="heading-xl mb-2">Find Your Dream Job</h1>
        <p className="text-primary-100 mb-6 opacity-90 text-sm md:text-base max-w-xl">
          Browse job openings from top companies. Your next career move starts here.
        </p>

        {/* Search bar */}
        <div className="bg-surface rounded-xl shadow-xl border border-app text-primary overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-app flex-1">
              <Search className="text-muted w-4 h-4 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full outline-none bg-transparent text-sm placeholder:text-secondary"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-app flex-1">
              <MapPin className="text-muted w-4 h-4 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Location (e.g. Remote)"
                className="w-full outline-none bg-transparent text-sm placeholder:text-secondary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 border-app">
              <SlidersHorizontal className="text-muted w-4 h-4 shrink-0 mr-3" />
              <select
                className="w-full outline-none bg-transparent text-sm text-secondary focus:ring-0 cursor-pointer"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="" className="bg-surface text-primary">All Types</option>
                <option value="Full-time" className="bg-surface text-primary">Full-time</option>
                <option value="Part-time" className="bg-surface text-primary">Part-time</option>
                <option value="Contract" className="bg-surface text-primary">Contract</option>
                <option value="Internship" className="bg-surface text-primary">Internship</option>
                <option value="Freelance" className="bg-surface text-primary">Freelance</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row border-t border-app">
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-app flex-1">
              <span className="text-sm text-secondary mr-2 min-w-max">Experience:</span>
              <select
                className="w-full outline-none bg-transparent text-sm text-secondary focus:ring-0 cursor-pointer"
                value={experienceLevel}
                onChange={handleExperienceChange}
              >
                <option value="" className="bg-surface text-primary">Any Level</option>
                <option value="Fresher" className="bg-surface text-primary">Fresher</option>
                <option value="Junior" className="bg-surface text-primary">Junior</option>
                <option value="Mid-Level" className="bg-surface text-primary">Mid-Level</option>
                <option value="Senior" className="bg-surface text-primary">Senior</option>
                <option value="Lead" className="bg-surface text-primary">Lead</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-app flex-1">
              <span className="text-sm text-secondary mr-2">Min Salary:</span>
              <input
                type="number"
                placeholder="e.g. 50000"
                className="w-full outline-none bg-transparent text-sm placeholder:text-secondary"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-3 md:border-b-0 border-app flex-1">
              <span className="text-sm text-secondary mr-2">Max Salary:</span>
              <input
                type="number"
                placeholder="e.g. 150000"
                className="w-full outline-none bg-transparent text-sm placeholder:text-secondary"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-secondary">
          {isFetching ? "Searching..." : `${pagination?.total ?? jobs.length} jobs found`}
        </p>
      </div>

      {/* Job grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-secondary">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="font-medium">No jobs found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {jobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="block group">
                <div className="card p-5 h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-11 h-11 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-app overflow-hidden shrink-0">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-muted" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge-primary">{job.type}</span>
                      {user?.role === "seeker" && (() => {
                        const isSaved = savedJobs?.some((j) => j._id === job._id);
                        return (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              isSaved ? unsaveJob(job._id) : saveJob(job._id);
                            }}
                            className="p-1.5 text-secondary hover:text-primary transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                            title={isSaved ? "Remove from saved" : "Save Job"}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary-600 text-primary-600" : ""}`} />
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  <h3 className="heading-md group-hover:text-primary-600 transition-colors mb-1 text-primary line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-secondary mb-4">{job.company?.name}</p>

                  <div className="mt-auto pt-3 border-t border-app flex flex-wrap gap-x-3 gap-y-1 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-muted" />
                      {job.salary?.min
                        ? `${(job.salary.min / 1000).toFixed(0)}k – ${(job.salary.max / 1000).toFixed(0)}k ${job.salary.currency || "INR"}`
                        : "Not disclosed"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-secondary text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || isFetching}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
      </div>
      {!isAuthenticated && <Footer />}
    </>
  );
}
