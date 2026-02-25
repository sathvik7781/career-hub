import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../api/apiCheck";
import toast from "react-hot-toast";

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (basicInfo) => {
      const { data } = await API.post("/profile/basic-info", { basicInfo });
      return data;
    },
    onSuccess: () => {
      toast.success("Basic info updated successfully");
      queryClient.invalidateQueries(["profile", "me"]);
    },
    onError: (err) => {
      // Allow component to handle specific form errors if necessary
      if (!err.response?.data?.errors) {
        toast.error("Failed to update basic info");
      }
    },
  });
};
