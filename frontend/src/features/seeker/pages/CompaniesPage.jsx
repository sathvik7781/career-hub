import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAllCompanies } from "../../recruiter/hooks/useCompany";
import { Search, Building2, MapPin, Globe, Loader2, Briefcase } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import Footer from "../../../components/layout/Footer";

export default function CompaniesPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get("search") || "");

  const { data, isLoading } = useAllCompanies(appliedSearch ? { search: appliedSearch } : {});
  const companies = data || [];

  useEffect(() => {
    const t = setTimeout(() => setAppliedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 rounded-2xl p-6 md:p-10 mb-8 text-white shadow-lg">
        <h1 className="heading-xl mb-2">Explore Companies</h1>
        <p className="text-primary-100 opacity-90 text-sm md:text-base mb-6 max-w-xl">
          Discover verified companies hiring on CareerHub.
        </p>
        <div className="bg-surface rounded-xl border border-app flex items-center px-4 py-3 gap-3 shadow-xl max-w-lg">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-primary placeholder:text-secondary"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-secondary mb-4">
        {isLoading ? "Loading..." : `${companies.length} compan${companies.length !== 1 ? "ies" : "y"} found`}
      </p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary w-8 h-8" />
        </div>
      ) : companies.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="font-medium text-primary">No companies found.</p>
          <p className="text-sm text-secondary mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {companies.map((company) => (
            <Link key={company._id} to={`/companies/${company._id}`} className="block group">
              <div className="card p-5 h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
                {/* Logo + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-app flex items-center justify-center shrink-0 overflow-hidden">
                    {company.logo
                      ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      : <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    }
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-primary group-hover:text-primary-600 transition-colors truncate">
                      {company.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mt-0.5">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Description */}
                {company.description && (
                  <p className="text-xs text-secondary line-clamp-2 mb-3 flex-1">{company.description}</p>
                )}

                {/* Meta */}
                <div className="mt-auto pt-3 border-t border-app flex flex-wrap gap-x-3 gap-y-1">
                  {company.location && (
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <MapPin className="w-3 h-3 text-muted" /> {company.location}
                    </span>
                  )}
                  {company.website && (
                    <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 truncate">
                      <Globe className="w-3 h-3 shrink-0" />
                      {company.website.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  <Briefcase className="w-3.5 h-3.5" /> View open jobs →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      {!isAuthenticated && <Footer />}
    </>
  );
}
