import api from "@/lib/api";

export const applyLeave = (payload) => api.post("/leave/apply", payload);

export const getMyLeaves = (employeeId) => api.get(`/leave/my/${employeeId}`);

export const getAllLeaves = () => api.get("/leave/all");

export const reviewLeave = (id, decision) => api.post(`/leave/review/${id}`, { decision });