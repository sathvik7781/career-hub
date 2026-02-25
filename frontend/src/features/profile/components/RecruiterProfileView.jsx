import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  useMyCompany,
  useJoinRequests,
  useSearchCompanies,
  useRespondToJoinRequest,
  useRequestToJoin,
  useLeaveCompany,
} from "../../recruiter/hooks/useCompany";
import {
  Building2,
  User,
  LogOut,
  Check,
  X,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input } from "../../../components/UI/FormElements";

export default function RecruiterProfileView() {
  const { user } = useContext(AuthContext);

  const { data: companyData, isLoading: loadingCompany } = useMyCompany();
  const company = companyData?.company;

  const { data: requestsData } = useJoinRequests(!!company);
  const joinRequests = requestsData?.requests || [];

  const { mutateAsync: requestToJoin } = useRequestToJoin();
  const { mutateAsync: respondToJoin } = useRespondToJoinRequest();
  const { mutate: leaveCompany } = useLeaveCompany();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: searchData, isFetching: searching } =
    useSearchCompanies(debouncedSearch);
  const searchResults = searchData?.companies || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setDebouncedSearch(searchTerm);
  };

  const handleJoinRequest = async (companyId) => {
    await requestToJoin(companyId);
  };

  const handleRespond = async (recruiterId, status) => {
    await respondToJoin({ recruiterId, status });
  };

  const handleLeave = () => {
    if (!window.confirm("Are you sure you want to leave the company?")) return;
    leaveCompany();
  };

  if (loadingCompany)
    return (
      <div className="p-8 text-center text-secondary">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">
      {/* Basic Info */}
      <div className="card p-6 mb-8">
        <h2 className="heading-ld flex items-center gap-2 mb-4 text-primary">
          <User className="text-primary-600 dark:text-primary-400" /> Recruiter
          Profile
        </h2>
        <div className="space-y-2">
          <p className="text-primary">
            <span className="font-medium text-secondary">Name:</span>{" "}
            {user.name}
          </p>
          <p className="text-primary">
            <span className="font-medium text-secondary">Email:</span>{" "}
            {user.email}
          </p>
        </div>
      </div>

      {/* Company Section */}
      {company ? (
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="heading-lg flex items-center gap-2 mb-2 text-primary">
                <Building2 className="text-primary-600 dark:text-primary-400" />{" "}
                {company.name}
              </h2>
              <p className="text-secondary mb-4">{company.description}</p>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    company.verificationStatus === "approved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : company.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {company.verificationStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {company.owner?._id === user.id || company.owner === user.id ? (
              <div className="badge-primary">Owner</div>
            ) : (
              <button
                onClick={handleLeave}
                className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium"
              >
                <LogOut size={16} /> Leave Company
              </button>
            )}
          </div>

          {/* Join Requests (Owner Only) */}
          {joinRequests.length > 0 && (
            <div className="mt-8 border-t border-app pt-6">
              <h3 className="heading-md mb-4 text-primary">
                Pending Join Requests
              </h3>
              <div className="space-y-3">
                {joinRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between p-3 bg-app rounded-lg border border-app"
                  >
                    <div>
                      <p className="font-medium text-primary">
                        {req.user?.name}
                      </p>
                      <p className="text-sm text-secondary">
                        {req.user?.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(req._id, "approved")}
                        className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded hover:bg-green-200"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, "rejected")}
                        className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="heading-lg flex items-center gap-2 mb-6 text-primary">
            <Building2 className="text-primary-600 dark:text-primary-400" />{" "}
            Join or Create Company
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Create */}
            <div className="space-y-4">
              <h3 className="heading-md text-primary">Register New Company</h3>
              <p className="text-sm text-secondary">
                Register your company to start posting jobs.
              </p>
              <Link to="/recruiter/company">
                <Button variant="primary" className="w-full sm:w-auto">
                  <Plus size={18} className="mr-2 inline" /> Register Company
                </Button>
              </Link>
            </div>

            {/* Search & Join */}
            <div className="space-y-4 border-l border-app pl-8">
              <h3 className="heading-md text-primary">Join Existing Company</h3>
              <p className="text-sm text-secondary">
                Search for your company and request to join.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Company name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={searching} variant="secondary">
                  {searching ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Search size={18} />
                  )}
                </Button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-2 mt-4 max-h-40 overflow-y-auto custom-scrollbar">
                  {searchResults.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between text-sm p-3 bg-app rounded border border-app"
                    >
                      <span className="text-primary">{c.name}</span>
                      <button
                        onClick={() => handleJoinRequest(c._id)}
                        className="text-primary-600 hover:underline font-medium"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
