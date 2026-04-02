import API from "../../../api/api";

export const getNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data.data;
};

export const markAsRead = async (id) => {
  const { data } = await API.patch(`/notifications/${id}/read`);
  return data.data;
};

export const markAllAsRead = async () => {
  const { data } = await API.patch("/notifications/read-all");
  return data.data;
};
