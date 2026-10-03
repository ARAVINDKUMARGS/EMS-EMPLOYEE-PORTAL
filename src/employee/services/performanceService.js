import api from "@/lib/api";

export const getMyPerformance = () => api.get("/performance/my");
export const getAllPerformance = () => api.get("/performance/all");
export const createReview = (payload) => api.post("/performance/review", payload);
export const createGoal = (payload) => api.post("/performance/goal", payload);
export const updateGoal = (id, payload) => api.put(`/performance/goal/${id}`, payload);
