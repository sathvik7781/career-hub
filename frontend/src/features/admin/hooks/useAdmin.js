import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../../recruiter/services/company.service";
import API from "../../../api/api";
import toast from "react-hot-toast";

// ── Company ──────────────────────────────────────────────────────────────────

export const useAdminCompanies = () =>
  useQuery({
    queryKey: ["admin", "companies"],
    queryFn: () => companyService.getAdminCompanies(),
    staleTime: 1000 * 60 * 5,
  });

export const useVerifyCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, payload }) => companyService.verifyCompany(companyId, payload),
    onSuccess: (_, variables) => {
      toast.success(`Company ${variables.payload.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Action failed"),
  });
};

// ── Jobs ─────────────────────────────────────────────────────────────────────

export const useAdminJobs = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v != null))
      ).toString();
      const res = await API.get(`/jobs/admin/all?${params}`);
      return { data: res.data.data, pagination: res.data.pagination };
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

export const useAdminDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => API.delete(`/jobs/admin/${jobId}`),
    onSuccess: () => {
      toast.success("Job removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to remove job"),
  });
};
