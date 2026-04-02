import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMyCompany, useUpdateCompany, useRegisterCompany } from "../hooks/useCompany";
import { Building2, MapPin, Globe, Loader2, Edit, BadgeCheck, Clock, XCircle } from "lucide-react";
import { Button, Input, TextArea } from "../../../components/UI/FormElements";

const STATUS_CONFIG = {
  approved: { icon: BadgeCheck, label: "Approved",  cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  pending:  { icon: Clock,      label: "Pending Review", cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  rejected: { icon: XCircle,    label: "Rejected",  cls: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800" },
  suspended:{ icon: XCircle,    label: "Suspended", cls: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
};

export default function CompanyManagementPage() {
  const { data: responseData, isLoading } = useMyCompany();
  const company = responseData;
  const { mutateAsync: updateCompany, isPending: updating } = useUpdateCompany();
  const { mutateAsync: registerCompany, isPending: registering } = useRegisterCompany();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (company && isEditing) {
      setValue("name", company.name);
      setValue("description", company.description);
      setValue("website", company.website);
      setValue("location", company.location);
    }
  }, [company, isEditing, setValue]);

  const onSubmit = async (data) => {
    if (company) { await updateCompany({ companyId: company._id, data }); setIsEditing(false); }
    else await registerCompany(data);
  };

  const isPending = updating || registering;

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  const status = STATUS_CONFIG[company?.verificationStatus] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Recruiter</p>
        <h1 className="heading-xl text-primary">Company Management</h1>
        <p className="text-sm text-secondary mt-1">
          {company ? "Manage your company profile and details." : "Register your company to start posting jobs."}
        </p>
      </div>

      {company && !isEditing ? (
        <div className="max-w-2xl space-y-5">
          {/* Company info card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-app">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-primary">{company.name}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${status.cls}`}>
                    <StatusIcon className="w-3 h-3" /> {status.label}
                  </span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="shrink-0">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>

            {company.description && (
              <p className="text-sm text-secondary mb-5">{company.description}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                <MapPin className="w-4 h-4 text-muted shrink-0" />
                <span className="text-sm text-secondary truncate">{company.location || "No location"}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-app">
                <Globe className="w-4 h-4 text-muted shrink-0" />
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate">
                    {company.website}
                  </a>
                ) : (
                  <span className="text-sm text-secondary">No website</span>
                )}
              </div>
            </div>

            {company.verificationStatus === "rejected" && (
              <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50 text-sm">
                <strong>Rejection Reason:</strong> {company.rejectionReason}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-app">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-primary">
                  {company ? "Edit Company" : "Register Your Company"}
                </h2>
                <p className="text-xs text-secondary">
                  {company ? "Update your company details." : "Fill in your company information to get started."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Company Name *"
                error={errors.name}
                {...register("name", { required: "Company name is required" })}
              />
              <TextArea
                label="Description"
                rows="4"
                placeholder="Tell candidates about your company..."
                {...register("description")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Location" placeholder="e.g. Bangalore, India" {...register("location")} />
                <Input label="Website" placeholder="https://yourcompany.com" {...register("website")} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={isPending} className="flex-1 sm:flex-none px-8">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : company ? "Save Changes" : "Register Company"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={isPending}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
