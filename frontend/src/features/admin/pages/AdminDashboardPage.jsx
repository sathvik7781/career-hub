import { useAdminCompanies, useVerifyCompany } from "../hooks/useAdmin";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminCompanies();
  const companies = data?.companies || [];

  const { mutate: verifyCompany } = useVerifyCompany();

  const handleVerify = (id, status) => {
    const reason =
      status === "rejected" ? prompt("Enter rejection reason:") : null;
    if (status === "rejected" && !reason) return;

    verifyCompany({
      companyId: id,
      payload: { status, rejectionReason: reason },
    });
  };

  if (isLoading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <h1 className="heading-xl mb-6 text-primary">Admin Dashboard</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-app">
            <thead className="bg-app">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-app">
              {companies.map((c) => (
                <tr key={c._id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary">{c.name}</div>
                    <div className="text-secondary text-sm">{c.website}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {c.owner?.user?.email || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge-primary
                          ${
                            c.verificationStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : c.verificationStatus === "rejected"
                                ? "bg-red-100 text-red-800"
                                : ""
                          }`}
                    >
                      {c.verificationStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    {c.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(c._id, "approved")}
                          className="text-green-600 dark:text-green-400 hover:underline"
                        >
                          Approve
                        </button>
                        <span className="text-muted">|</span>
                        <button
                          onClick={() => handleVerify(c._id, "rejected")}
                          className="text-red-600 dark:text-red-400 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {c.verificationStatus === "approved" && (
                      <button
                        onClick={() => handleVerify(c._id, "suspended")}
                        className="text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                    {c.verificationStatus === "suspended" && (
                      <button
                        onClick={() => handleVerify(c._id, "approved")}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Unsuspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
