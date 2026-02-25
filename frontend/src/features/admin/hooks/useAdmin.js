import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../../recruiter/services/company.service";
import toast from "react-hot-toast";

// --- Queries ---
export const useAdminCompanies = () => {
  return useQuery({
    queryKey: ["admin", "companies"],
    queryFn: () => companyService.getCompanies(),
    staleTime: 1000 * 60 * 5,
  });
};

// --- Mutations ---
export const useVerifyCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, payload }) =>
      companyService.verifyCompany(companyId, payload),
    onSuccess: (_, variables) => {
      toast.success(`Company ${variables.payload.status}`);
      queryClient.invalidateQueries(["admin", "companies"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Action failed"),
  });
};
