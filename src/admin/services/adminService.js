import api from "@/lib/api";

export const getAdminAnalytics = () => api.get("/dashboard/analytics");
export const getAuditLogs = () => api.get("/audit-logs");
export const getSystemSettings = () => api.get("/settings");
export const saveSystemSettings = (payload) => api.post("/settings", payload);
