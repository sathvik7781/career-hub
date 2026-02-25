import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/application.service";
import toast from "react-hot-toast";

// --- Queries ---
export const useMyApplications = () => {
  return useQuery({
    queryKey: ["applications", "me"],
    queryFn: applicationService.getMyApplications,
    staleTime: 1000 * 60 * 5,
  });
};

export const useJobApplications = (jobId) => {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => applicationService.getJobApplications(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
  });
};

// --- Mutations ---
export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationService.applyToJob,
    onSuccess: (_, variables) => {
      toast.success("Applied to job successfully!");
      // Might want to invalidate job details or my applications
      queryClient.invalidateQueries(["applications", "me"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to apply"),
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }) =>
      applicationService.updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      toast.success(`Status updated to ${variables.status}`);
      // Invalidate the job applications query so UI updates
      // Note: We don't have jobId directly here unless passed, so we might need to invalidate all queries
      // or invalidate specific if known. It's safe to invalidate applications.
      queryClient.invalidateQueries(["applications", "job"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to update status"),
  });
};
