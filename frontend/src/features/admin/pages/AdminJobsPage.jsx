import { useState } from "react";
import { useAdminJobs, useAdminDeleteJob } from "../hooks/useAdmin";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  Briefcase, MapPin, Clock, Building2, Search,
  SlidersHorizontal, Trash2, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "../../../components/UI/FormElements";

const STATUS_STYLES = {
  active:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  closed:   "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border-gray-200 dark:border-slate-700",
  archived: "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500 border-gray-200 dark:border-slate-700",
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

export default function AdminJobsPage() {
  const [keyword, setKeyword]   = useState("");
  const [type, setType]         = useState("");
  const [status, setStatus]     = useState("");
  const [page, setPage]         = useState(1);
  const [modal, setModal]       = useState({ isOpen: false, jobId: null, title: "" });

  const { data, isLoading, isFetching } = useAdminJobs({
    keyword: keyword || undefined,
    type: type || undefined,
    status: status || undefined,
    page,
    limit: 15,
  });

  const { mutate: deleteJob } = useAdminDeleteJob();

  const jobs       = data?.data || [];
  const pagination = data?.pagination;

  const openModal  = (jobId, title) => setModal({ isOpen: true, jobId, title });
  const closeModal = () => setModal({ isOpen: false, jobId: null, title: "" });
  const handleConfirm = () => { deleteJob(modal.jobId); closeModal(); };

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <ConfirmModal
        isOpen={modal.isOpen}
        title="Remove Job"
        message={`Remove "${modal.title}"? This will archive the listing and hide it from seekers.`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="heading-xl text-primary">Job Management</h1>
        <p className="text-sm text-secondary mt-1">
          {isFetching ? "Loading…" : `${pagination?.total ?? jobs.length} total jobs`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-surface border border-app rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search by title or description…"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            className="w-full bg-transparent outline-none text-sm text-primary placeholder:text-secondary"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface border border-app rounded-xl px-4 py-2.5">
          <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="bg-transparent outline-none text-sm text-secondary cursor-pointer"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-app rounded-xl px-4 py-2.5">
          <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-transparent outline-none text-sm text-secondary cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <Briefcase className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-secondary text-sm">No jobs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-app overflow-hidden">
                    {job.company?.logo
                      ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                      : <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">{job.title}</h3>
                    <p className="text-xs text-secondary mt-0.5">{job.company?.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="w-3 h-3" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[job.status] || STATUS_STYLES.closed}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openModal(job._id, job.title)}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-2 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isFetching}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-secondary text-sm">Page {pagination.page} of {pagination.totalPages}</span>
          <Button variant="secondary" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages || isFetching}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
