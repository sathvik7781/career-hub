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
    onSuccess: () => {
      toast.success("Applied to job successfully!");
      queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
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
      queryClient.invalidateQueries({ queryKey: ["applications", "job"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to update status"),
  });
};
