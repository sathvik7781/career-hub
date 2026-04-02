import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import toast from "react-hot-toast";

export const useSavedJobs = (enabled = true) => {
  return useQuery({
    queryKey: ["savedJobs"],
    queryFn: profileService.getSavedJobs,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Job saved successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save job");
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Job removed from saved jobs");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unsave job");
    },
  });
};
