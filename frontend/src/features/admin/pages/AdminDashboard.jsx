import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminCompanies, useVerifyCompany } from "../hooks/useAdmin";
import { useAllJobs } from "../../jobs/hooks/useJobs";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  Building2, Briefcase, CheckCircle, Clock, XCircle,
  ShieldAlert, ArrowRight, Globe, MapPin,
} from "lucide-react";

const STATUS_CONFIG = {
  approved:  { label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: CheckCircle  },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",             icon: Clock        },
  rejected:  { label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",                         icon: XCircle      },
  suspended: { label: "Suspended", cls: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800",       icon: ShieldAlert  },
};

export default function AdminDashboard() {
  const { data: companiesData } = useAdminCompanies();
  const { data: jobsData }      = useAllJobs({ limit: 5 });
  const { mutate: verifyCompany } = useVerifyCompany();
  const [modal, setModal] = useState({ isOpen: false, companyId: null, status: null });

  const companies  = companiesData || [];
  const recentJobs = jobsData?.data?.slice(0, 5) || [];
  const pending    = companies.filter(c => c.verificationStatus === "pending");
  const approved   = companies.filter(c => c.verificationStatus === "approved");
  const suspended  = companies.filter(c => c.verificationStatus === "suspended");

  const openModal  = (id, status) => setModal({ isOpen: true, companyId: id, status });
  const closeModal = () => setModal({ isOpen: false, companyId: null, status: null });
  const handleConfirm = (reason) => {
    verifyCompany({ companyId: modal.companyId, payload: { status: modal.status, rejectionReason: reason || null } });
    closeModal();
  };

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.status === "rejected" ? "Reject Company" : modal.status === "suspended" ? "Suspend Company" : "Confirm Action"}
        message={modal.status === "rejected" ? "Please provide a reason for rejection." : `Are you sure you want to ${modal.status} this company?`}
        confirmLabel={modal.status === "rejected" ? "Reject" : "Confirm"}
        variant={modal.status === "rejected" || modal.status === "suspended" ? "danger" : "primary"}
        withReason={modal.status === "rejected"}
        reasonPlaceholder="Enter rejection reason..."
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="heading-xl text-primary">Admin Dashboard 🛡️</h1>
        <p className="text-sm text-secondary mt-1">Monitor and manage the CareerHub platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Companies", value: companies.length, icon: Building2,  color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20"       },
          { label: "Pending Review",  value: pending.length,   icon: Clock,      color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20"     },
          { label: "Approved",        value: approved.length,  icon: CheckCircle,color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Suspended",       value: suspended.length, icon: ShieldAlert,color: "text-orange-600 dark:text-orange-400",bg: "bg-orange-50 dark:bg-orange-900/20"   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pending companies */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-md text-primary">
              Pending Reviews
              {pending.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">{pending.length}</span>
              )}
            </h2>
            <Link to="/admin" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-secondary">All companies reviewed!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 5).map((c) => {
                const s = STATUS_CONFIG[c.verificationStatus];
                const StatusIcon = s.icon;
                return (
                  <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{c.name}</p>
                        <p className="text-xs text-secondary truncate">{c.owner?.user?.email || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button onClick={() => openModal(c._id, "approved")}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 rounded-lg transition-colors">
                        Approve
                      </button>
                      <button onClick={() => openModal(c._id, "rejected")}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-lg transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* All companies summary */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Company Overview</h2>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, { label, cls, icon: Icon }]) => {
                const count = companies.filter(c => c.verificationStatus === key).length;
                return (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-sm text-secondary">{label}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="heading-md text-primary mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "All Companies",  to: "/admin",      icon: Building2 },
                { label: "Job Management", to: "/admin/jobs", icon: Briefcase },
                { label: "Browse Jobs",    to: "/jobs",       icon: Briefcase },
                { label: "Companies Page", to: "/companies",  icon: Globe     },
              ].map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-md text-primary">Recent Job Listings</h2>
          <Link to="/jobs" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentJobs.map((job) => (
            <div key={job._id} className="flex items-start gap-3 p-3 rounded-xl border border-app bg-gray-50 dark:bg-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary truncate">{job.title}</p>
                <p className="text-xs text-secondary truncate">{job.company?.name}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                  <MapPin className="w-3 h-3" /> {job.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
