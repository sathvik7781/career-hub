import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePostJob, useUpdateJob, useJobDetails } from "../../jobs/hooks/useJobs";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, TextArea } from "../../../components/UI/FormElements";
import { Loader2, Briefcase, ArrowLeft } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid-Level", "Senior", "Lead", "Any"];

export default function JobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const { data: job, isLoading: fetchingJob } = useJobDetails(id);
  // useJobDetails returns the job object directly (not wrapped in { job })
  const { mutateAsync: postJob, isPending: posting } = usePostJob();
  const { mutateAsync: updateJob, isPending: updating } = useUpdateJob();
  const isPending = posting || updating;

  useEffect(() => {
    if (id && job) {
      setValue("title", job.title);
      setValue("description", job.description);
      setValue("type", job.type);
      setValue("location", job.location);
      setValue("experienceLevel", job.experienceLevel || "Any");
      if (job.salary) {
        setValue("salary.min", job.salary.min);
        setValue("salary.max", job.salary.max);
      }
    }
  }, [id, job, setValue]);

  const onSubmit = async (data) => {
    if (id) await updateJob({ jobId: id, data });
    else await postJob(data);
    navigate("/recruiter/jobs");
  };

  if (id && fetchingJob)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">
          {id ? "Edit" : "New"}
        </p>
        <h1 className="heading-xl text-primary">{id ? "Edit Job" : "Post a New Job"}</h1>
        <p className="text-sm text-secondary mt-1">
          {id ? "Update the job details below." : "Fill in the details to attract the right candidates."}
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="card p-6 md:p-8">
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-app">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">Job Details</h2>
              <p className="text-xs text-secondary">All fields marked * are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Job Title *"
              placeholder="e.g. Senior React Developer"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-secondary">Job Type *</label>
                <select
                  {...register("type", { required: true })}
                  className="input-field"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-secondary">Experience Level *</label>
                <select
                  {...register("experienceLevel", { required: true })}
                  className="input-field"
                >
                  {EXPERIENCE_LEVELS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Location *"
                placeholder="e.g. Remote, Bangalore"
                {...register("location", { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Min Salary"
                placeholder="e.g. 500000"
                {...register("salary.min")}
              />
              <div>
                <Input
                  type="number"
                  label="Max Salary"
                  placeholder="e.g. 800000"
                  error={errors.salary?.max}
                  {...register("salary.max", {
                    validate: (val) =>
                      !val || !watch("salary.min") ||
                      Number(val) >= Number(watch("salary.min")) ||
                      "Must be ≥ min salary",
                  })}
                />
              </div>
            </div>

            <TextArea
              label="Description *"
              rows="6"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              error={errors.description}
              {...register("description", { required: "Description is required" })}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" disabled={isPending} className="flex-1 sm:flex-none px-8 py-2.5">
                {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : id ? "Update Job" : "Post Job"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/recruiter/jobs")} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
