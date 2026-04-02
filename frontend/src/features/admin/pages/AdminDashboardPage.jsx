import { useState } from "react";
import { useAdminCompanies, useVerifyCompany } from "../hooks/useAdmin";
import { Loader2, Building2, Globe, MapPin, BadgeCheck, Clock, XCircle, ShieldAlert } from "lucide-react";
import ConfirmModal from "../../../components/common/ConfirmModal";

const STATUS_CONFIG = {
  approved:  { icon: BadgeCheck,  label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  pending:   { icon: Clock,       label: "Pending",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  rejected:  { icon: XCircle,     label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800" },
  suspended: { icon: ShieldAlert, label: "Suspended", cls: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminCompanies();
  const companies = data || [];
  const { mutate: verifyCompany } = useVerifyCompany();
  const [modal, setModal] = useState({ isOpen: false, companyId: null, status: null });

  const openModal = (id, status) => setModal({ isOpen: true, companyId: id, status });
  const closeModal = () => setModal({ isOpen: false, companyId: null, status: null });

  const handleConfirm = (reason) => {
    verifyCompany({ companyId: modal.companyId, payload: { status: modal.status, rejectionReason: reason || null } });
    closeModal();
  };

  const counts = {
    total: companies.length,
    pending: companies.filter((c) => c.verificationStatus === "pending").length,
    approved: companies.filter((c) => c.verificationStatus === "approved").length,
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

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
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="heading-xl text-primary">Dashboard</h1>
        <p className="text-sm text-secondary mt-1">Review and manage company verification requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Companies", value: counts.total, cls: "text-primary" },
          { label: "Pending Review",  value: counts.pending, cls: "text-amber-600 dark:text-amber-400" },
          { label: "Approved",        value: counts.approved, cls: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ label, value, cls }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${cls}`}>{value}</p>
            <p className="text-xs text-secondary mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Company list */}
      {companies.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <Building2 className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-secondary text-sm">No companies registered yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((c) => {
            const s = STATUS_CONFIG[c.verificationStatus] || STATUS_CONFIG.pending;
            const StatusIcon = s.icon;
            return (
              <div key={c._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{c.name}</h3>
                      <p className="text-xs text-secondary mt-0.5">{c.owner?.user?.email || "Unknown owner"}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        {c.location && (
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <MapPin className="w-3 h-3" /> {c.location}
                          </span>
                        )}
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                            <Globe className="w-3 h-3" /> {c.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
                      <StatusIcon className="w-3 h-3" /> {s.label}
                    </span>

                    <div className="flex items-center gap-1">
                      {c.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => openModal(c._id, "approved")}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(c._id, "rejected")}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {c.verificationStatus === "approved" && (
                        <button
                          onClick={() => openModal(c._id, "suspended")}
                          className="px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      {c.verificationStatus === "suspended" && (
                        <button
                          onClick={() => openModal(c._id, "approved")}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
                        >
                          Unsuspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
