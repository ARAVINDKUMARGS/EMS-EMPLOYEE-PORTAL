import api from "@/lib/api";

export const getMyPayroll = () => api.get("/payroll/my");
export const getAdminPayroll = () => api.get("/payroll/admin");
export const runPayroll = () => api.post("/payroll/run");
