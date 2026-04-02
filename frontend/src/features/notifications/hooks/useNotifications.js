import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead } from "../services/notificationApi";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 3, // auto poll every 3 mins
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return old.map((notif) =>
          notif._id === updatedNotification._id ? updatedNotification : notif
        );
      });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return old.map((notif) => ({ ...notif, isRead: true }));
      });
    },
  });
};
