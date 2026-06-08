import API from "../api/axios";

const getNotifications = async () => {
  const res = await API.get("/notifications/");
  return res.data;
};

const markAsRead = async (id) => {
  const res = await API.patch(`/notifications/${id}/read/`);
  return res.data;
};

export default {
  getNotifications,
  markAsRead,
};