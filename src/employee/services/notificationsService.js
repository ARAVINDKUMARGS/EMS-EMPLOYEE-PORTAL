import api from "@/lib/api";

export const getNotifications = () => api.get("/notifications");
export const createNotification = (payload) => api.post("/notifications", payload);
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => api.patch("/notifications/read-all");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
