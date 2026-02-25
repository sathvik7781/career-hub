import { useParams } from "react-router-dom";
import {
  useJobApplications,
  useUpdateApplicationStatus,
} from "../../applications/hooks/useApplications";
import { Loader2 } from "lucide-react";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const { data, isLoading } = useJobApplications(jobId);
  const applications = data?.applications || [];

  const { mutate: updateStatus } = useUpdateApplicationStatus();

  if (isLoading)
    return (
      <div className="p-10 text-center text-secondary">
        <Loader2 className="animate-spin text-secondary mx-auto w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <h1 className="heading-ld mb-6 text-primary">Job Applications</h1>

      {applications.length === 0 ? (
        <p className="text-secondary text-center">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto card">
          <table className="min-w-full divide-y divide-app">
            <thead className="bg-app">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Applied At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Resume
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
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary">
                      {app.applicant.basicInfo?.firstName}{" "}
                      {app.applicant.basicInfo?.lastName}
                    </div>
                    <div className="text-sm text-secondary">
                      {app.applicant.basicInfo?.phone || "No phone"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400">
                    <span className="cursor-pointer hover:underline">
                      View Resume
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge-primary ${
                        app.status === "hired"
                          ? "bg-green-100 text-green-800"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : ""
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus({
                          applicationId: app._id,
                          status: e.target.value,
                        })
                      }
                      className="input-field py-1 px-2 text-sm w-auto"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
