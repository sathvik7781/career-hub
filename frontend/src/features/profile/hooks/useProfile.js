import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: profileService.getProfile,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
