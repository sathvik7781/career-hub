import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useMyCompany,
  useUpdateCompany,
  useRegisterCompany,
} from "../hooks/useCompany";
import { Building2, MapPin, Globe, Loader2 } from "lucide-react";
import { Button, Input, TextArea } from "../../../components/UI/FormElements";

export default function CompanyManagementPage() {
  const { data: responseData, isLoading: fetchLoading } = useMyCompany();
  const company = responseData?.company;

  const { mutateAsync: updateCompany, isPending: updateLoading } =
    useUpdateCompany();
  const { mutateAsync: registerCompany, isPending: registerLoading } =
    useRegisterCompany();

  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Pre-fill form when entering edit mode or when company data loads
  useEffect(() => {
    if (company && isEditing) {
      setValue("name", company.name);
      setValue("description", company.description);
      setValue("website", company.website);
      setValue("location", company.location);
    }
  }, [company, isEditing, setValue]);

  const onSubmit = async (data) => {
    if (company) {
      await updateCompany({ companyId: company._id, data });
      setIsEditing(false);
    } else {
      await registerCompany(data);
    }
  };

  const loading = fetchLoading || updateLoading || registerLoading;

  if (fetchLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-secondary" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn">
      <h1 className="heading-xl mb-6 text-primary">Company Management</h1>

      {company && !isEditing ? (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="heading-lg text-primary flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                {company.name}
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 
                    ${
                      company.verificationStatus === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : company.verificationStatus === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
              >
                {company.verificationStatus.toUpperCase()}
              </span>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="secondary">
              Edit Details
            </Button>
          </div>

          <p className="text-secondary mb-4">{company.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted" />
              {company.location || "No location provided"}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted" />
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {company.website}
                </a>
              ) : (
                "No website"
              )}
            </div>
          </div>

          {company.verificationStatus === "rejected" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
              <strong>Rejection Reason:</strong> {company.rejectionReason}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-8">
          <h2 className="heading-md mb-4 text-primary">
            {company ? "Edit Company" : "Register Your Company"}
          </h2>

          <div className="space-y-4">
            <div>
              <Input
                label="Company Name"
                {...register("name", { required: "Company name is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <TextArea
                label="Description"
                rows="4"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input label="Location" {...register("location")} />
              </div>
              <div>
                <Input
                  label="Website"
                  placeholder="https://..."
                  {...register("website")}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : company ? (
                  "Save Changes"
                ) : (
                  "Register Company"
                )}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
