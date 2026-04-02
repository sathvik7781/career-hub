import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  useMyCompany, useJoinRequests, useSearchCompanies,
  useRespondToJoinRequest, useRequestToJoin, useLeaveCompany,
} from "../../recruiter/hooks/useCompany";
import {
  Building2, User, LogOut, Check, X, Search,
  Plus, Loader2, BadgeCheck, Clock, XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  approved: { icon: BadgeCheck, label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  pending:  { icon: Clock,      label: "Pending",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  rejected: { icon: XCircle,    label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800" },
};

export default function RecruiterProfileView() {
  const { user } = useContext(AuthContext);
  const { data: companyData, isLoading } = useMyCompany();
  const company = companyData;

  const { data: requestsData } = useJoinRequests(!!company);
  const joinRequests = requestsData || [];

  const { mutateAsync: requestToJoin } = useRequestToJoin();
  const { mutateAsync: respondToJoin } = useRespondToJoinRequest();
  const { mutate: leaveCompany } = useLeaveCompany();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const { data: searchData, isFetching: searching } = useSearchCompanies(debouncedSearch);
  const searchResults = searchData || [];

  const isOwner = company?.owner?._id === user.id || company?.owner === user.id;

  const STATUS_CONFIG = {
    approved: { icon: BadgeCheck, label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    pending:  { icon: Clock,      label: "Pending",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
    rejected: { icon: XCircle,    label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800" },
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-muted" />
    </div>
  );

  return (
    <div className="page-container section-spacing animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Account</p>
        <h1 className="heading-xl text-primary">My Profile</h1>
        <p className="text-sm text-secondary mt-1">Manage your recruiter account and company</p>
      </div>

      <div className="space-y-5">

        {/* ── Basic Info Card ── */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-app">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">Recruiter Info</h2>
              <p className="text-xs text-secondary">Your account details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted mb-1">Full Name</p>
              <p className="text-sm font-medium text-primary">{user.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Email Address</p>
              <p className="text-sm font-medium text-primary">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Role</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                Recruiter
              </span>
            </div>
          </div>
        </div>

        {/* ── Company Card ── */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-app">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">Company</h2>
              <p className="text-xs text-secondary">
                {company ? "Your current company" : "Join or register a company"}
              </p>
            </div>
          </div>

          {company ? (
            <div className="space-y-5">
              {/* Company info */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-primary">{company.name}</h3>
                  {company.description && (
                    <p className="text-sm text-secondary">{company.description}</p>
                  )}
                  {(() => {
                    const s = STATUS_CONFIG[company.verificationStatus] || STATUS_CONFIG.pending;
                    const Icon = s.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex-shrink-0">
                  {isOwner ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      Owner
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Leave
                    </button>
                  )}
                </div>
              </div>

              {/* Join requests — owner only */}
              {isOwner && joinRequests.length > 0 && (
                <div className="border-t border-app pt-5">
                  <h3 className="text-sm font-semibold text-primary mb-3">
                    Pending Join Requests
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                      {joinRequests.length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {joinRequests.map((req) => (
                      <div key={req._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                        <div>
                          <p className="text-sm font-medium text-primary">{req.user?.name}</p>
                          <p className="text-xs text-secondary">{req.user?.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => respondToJoin({ recruiterId: req._id, status: "approved" })}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => respondToJoin({ recruiterId: req._id, status: "rejected" })}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Register */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary">Register New Company</h3>
                <p className="text-xs text-secondary">Register your company to start posting jobs.</p>
                <Link
                  to="/recruiter/company"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" /> Register Company
                </Link>
              </div>

              {/* Join */}
              <div className="space-y-3 sm:border-l sm:border-app sm:pl-6">
                <h3 className="text-sm font-semibold text-primary">Join Existing Company</h3>
                <p className="text-xs text-secondary">Search for your company and request to join.</p>
                <form onSubmit={(e) => { e.preventDefault(); if (searchTerm.trim()) setDebouncedSearch(searchTerm); }} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Company name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button type="submit" disabled={searching} className="btn-secondary px-3">
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </form>
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map((c) => (
                      <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app text-sm">
                        <span className="text-primary font-medium">{c.name}</span>
                        <button
                          onClick={() => requestToJoin(c._id)}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Request to Join
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave Company"
        message="Are you sure you want to leave the company? You will lose access to all company jobs."
        confirmLabel="Leave"
        variant="danger"
        onConfirm={() => { leaveCompany(); setShowLeaveModal(false); }}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
}
