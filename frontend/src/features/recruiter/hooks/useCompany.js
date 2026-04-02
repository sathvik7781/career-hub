import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../services/company.service";
import toast from "react-hot-toast";

export const useAllCompanies = (filters = {}) => {
  return useQuery({
    queryKey: ["companies", "all", filters],
    queryFn: () => companyService.getCompanies({ ...filters, status: "approved" }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCompanyById = (companyId) => {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyService.getCompanyById(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  });
};

// --- Queries ---
export const useMyCompany = () => {
  return useQuery({
    queryKey: ["company", "me"],
    queryFn: companyService.getMyCompany,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: false, // Don't keep retrying if recruiter doesn't have a company yet
  });
};

export const useJoinRequests = (enabled) => {
  return useQuery({
    queryKey: ["company", "requests"],
    queryFn: companyService.getJoinRequests,
    enabled,
    staleTime: 1000 * 60,
  });
};

export const useSearchCompanies = (searchTerm) => {
  return useQuery({
    queryKey: ["companies", "search", searchTerm],
    queryFn: () => companyService.getCompanies({ search: searchTerm }),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5,
  });
};

// --- Mutations ---
export const useRegisterCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companyService.registerCompany,
    onSuccess: () => {
      toast.success("Company registered! Pending verification.");
      queryClient.invalidateQueries({ queryKey: ["company", "me"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }) =>
      companyService.updateCompany(companyId, data),
    onSuccess: () => {
      toast.success("Company updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["company", "me"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};

export const useRequestToJoin = () => {
  return useMutation({
    mutationFn: companyService.requestToJoinCompany,
    onSuccess: () => toast.success("Request sent successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to send request"),
  });
};

export const useRespondToJoinRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recruiterId, status }) =>
      companyService.respondToJoinRequest(recruiterId, status),
    onSuccess: (_, variables) => {
      toast.success(`Request ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["company", "requests"] });
    },
    onError: () => toast.error("Action failed"),
  });
};

export const useLeaveCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companyService.leaveCompany,
    onSuccess: () => {
      toast.success("Left company");
      queryClient.invalidateQueries({ queryKey: ["company", "me"] });
      queryClient.invalidateQueries({ queryKey: ["company", "requests"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to leave"),
  });
};
