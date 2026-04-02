import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "../services/job.service";
import toast from "react-hot-toast";

// --- Queries ---
export const useRecruiterJobs = () => {
  return useQuery({
    queryKey: ["jobs", "recruiter", "me"],
    queryFn: jobService.getMyJobs,
    staleTime: 1000 * 60 * 5,
  });
};

export const useJobDetails = (id) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllJobs = (filters = {}) => {
  return useQuery({
    queryKey: ["jobs", "all", filters],
    queryFn: () => jobService.getJobs(filters),
    staleTime: 1000 * 60 * 2, // 2 min — job listings change more frequently
    placeholderData: (prev) => prev, // keep previous page data while fetching next
  });
};

// --- Mutations ---
export const usePostJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobService.postJob,
    onSuccess: () => {
      toast.success("Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs", "recruiter", "me"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to post job"),
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }) => jobService.updateJob(jobId, data),
    onSuccess: (_, variables) => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs", "recruiter", "me"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to update job"),
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs", "recruiter", "me"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to delete job"),
  });
};
