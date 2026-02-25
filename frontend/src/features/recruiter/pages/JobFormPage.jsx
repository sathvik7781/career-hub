import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  usePostJob,
  useUpdateJob,
  useJobDetails,
} from "../../jobs/hooks/useJobs";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, TextArea } from "../../../components/UI/FormElements";
import { Loader2 } from "lucide-react";

export default function JobFormPage() {
  const { id } = useParams(); // If editing
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: jobData, isLoading: fetchingJob } = useJobDetails(id);
  const { mutateAsync: postJob, isPending: postingJob } = usePostJob();
  const { mutateAsync: updateJob, isPending: updatingJob } = useUpdateJob();

  useEffect(() => {
    if (id && jobData?.job) {
      const j = jobData.job;
      setValue("title", j.title);
      setValue("description", j.description);
      setValue("type", j.type);
      setValue("location", j.location);
      if (j.salary) {
        setValue("salary.min", j.salary.min);
        setValue("salary.max", j.salary.max);
      }
    }
  }, [id, jobData, setValue]);

  const onSubmit = async (data) => {
    if (id) {
      await updateJob({ jobId: id, data });
    } else {
      await postJob(data);
    }
    navigate("/recruiter/jobs");
  };

  const isPending = postingJob || updatingJob;

  if (id && fetchingJob) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="page-container animate-fadeIn section-spacing">
      <h1 className="heading-xl mb-8 text-primary content-center">
        {id ? "Edit Job" : "Post a New Job"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-6">
        <div>
          <Input
            label="Job Title"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g. Senior React Developer"
          />
          {errors.title && (
            <span className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-secondary">
              Job Type
            </label>
            <select
              {...register("type", { required: true })}
              className="input-field"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <Input
              label="Location"
              {...register("location", { required: true })}
              placeholder="e.g. Remote, New York"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              label="Min Salary"
              {...register("salary.min")}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Max Salary"
              {...register("salary.max")}
              placeholder="e.g. 80000"
            />
          </div>
        </div>

        <div>
          <TextArea
            label="Description"
            {...register("description", {
              required: "Description is required",
            })}
            rows="6"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
          {errors.description && (
            <span className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          className="w-full py-3"
        >
          {isPending ? (
            <Loader2 className="animate-spin text-white mx-auto w-5 h-5" />
          ) : id ? (
            "Update Job"
          ) : (
            "Post Job"
          )}
        </Button>
      </form>
    </div>
  );
}
