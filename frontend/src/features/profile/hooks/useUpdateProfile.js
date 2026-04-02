import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const PROFILE_KEY = { queryKey: ["profile", "me"] };

const profileMutation = (mutationFn, successMsg) => () => {
  const queryClient = useQueryClient();
  const { updateProfileComplete } = useContext(AuthContext);
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (successMsg) toast.success(successMsg);
      queryClient.invalidateQueries(PROFILE_KEY);
      // Sync isProfileComplete in AuthContext so stale JWT value is overridden immediately
      if (data?.completion?.percentage === 100) updateProfileComplete(true);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Action failed"),
  });
};

export const useUpdateBasicInfo = profileMutation(profileService.updateBasicInfo, null);

// Education
export const useAddEducation    = profileMutation(profileService.addEducation,    "Education added");
export const useUpdateEducation = profileMutation(profileService.updateEducation, "Education updated");
export const useDeleteEducation = profileMutation(profileService.deleteEducation, "Education deleted");

// Professional
export const useUpdateProfessional = profileMutation(profileService.updateProfessional, "Professional section updated");
export const useAddExperience      = profileMutation(profileService.addExperience,      "Experience added");
export const useUpdateExperience   = profileMutation(profileService.updateExperience,   "Experience updated");
export const useDeleteExperience   = profileMutation(profileService.deleteExperience,   "Experience deleted");

// Skills & Projects
export const useAddSkill      = profileMutation(profileService.addSkill,      "Skill added");
export const useDeleteSkill   = profileMutation(profileService.deleteSkill,   "Skill removed");
export const useAddProject    = profileMutation(profileService.addProject,    "Project added");
export const useUpdateProject = profileMutation(profileService.updateProject, "Project updated");
export const useDeleteProject = profileMutation(profileService.deleteProject, "Project deleted");

// Resume & Avatar
export const useUploadResume = profileMutation(profileService.uploadResume, "Resume uploaded");
export const useDeleteResume = profileMutation(profileService.deleteResume, "Resume deleted");
export const useRemoveAvatar = profileMutation(profileService.removeAvatar, "Photo removed");
