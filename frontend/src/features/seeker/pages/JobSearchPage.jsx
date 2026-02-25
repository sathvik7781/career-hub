import { useState } from "react";
import { useAllJobs } from "../../jobs/hooks/useJobs";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Building2, Loader2 } from "lucide-react";
import { Button } from "../../../components/UI/FormElements";

export default function JobSearchPage() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // useAllJobs utilizes the appliedFilters to trigger a re-fetch when they change
  const { data, isLoading, isFetching } = useAllJobs(appliedFilters);
  const jobs = data?.jobs || [];

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 mb-10 text-white shadow-lg">
        <h1 className="heading-xl mb-4">Find Your Dream Job</h1>
        <p className="text-primary-100 mb-8 max-w-2xl opacity-90">
          Browse thousands of job openings from top companies and startups. Your
          next career move starts here.
        </p>

        <form
          onSubmit={handleSearch}
          className="bg-surface p-2 rounded-xl flex flex-col md:flex-row gap-2 shadow-xl border border-app text-primary"
        >
          <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-app">
            <Search className="text-muted w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full py-3 outline-none bg-transparent placeholder-secondary"
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />
          </div>
          <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-app">
            <MapPin className="text-muted w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Location (e.g. Remote)"
              className="w-full py-3 outline-none bg-transparent placeholder-secondary"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
          </div>
          <select
            className="px-4 py-3 outline-none bg-transparent border-b md:border-b-0 md:border-r border-app focus:ring-0 text-secondary"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="" className="bg-surface">
              All Types
            </option>
            <option value="Full-time" className="bg-surface">
              Full-time
            </option>
            <option value="Part-time" className="bg-surface">
              Part-time
            </option>
            <option value="Contract" className="bg-surface">
              Contract
            </option>
            <option value="Internship" className="bg-surface">
              Internship
            </option>
            <option value="Freelance" className="bg-surface">
              Freelance
            </option>
          </select>
          <Button
            type="submit"
            variant="primary"
            className="px-8 py-3 rounded-lg font-bold w-full md:w-auto mt-2 md:mt-0"
            disabled={isFetching}
          >
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-20 text-secondary">
              No jobs found matching your criteria.
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                to={`/jobs/${job._id}`}
                key={job._id}
                className="block group"
              >
                <div className="card p-6 h-full flex flex-col hover:-translate-y-1 duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500 overflow-hidden">
                      {job.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <span className="badge-primary">{job.type}</span>
                  </div>
                  <h3 className="heading-md group-hover:text-primary-600 transition mb-1 text-primary">
                    {job.title}
                  </h3>
                  <p className="text-sm text-secondary mb-4">
                    {job.company?.name}
                  </p>

                  <div className="mt-auto pt-4 border-t border-app flex items-center text-sm text-secondary">
                    <MapPin className="w-4 h-4 mr-1 text-muted" />{" "}
                    {job.location}
                    <span className="mx-2 text-muted">•</span>
                    <Briefcase className="w-4 h-4 mr-1 text-muted" />{" "}
                    {job.salary
                      ? `${job.salary.min / 1000}k - ${job.salary.max / 1000}k`
                      : "Not disclosed"}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
