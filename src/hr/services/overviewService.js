import api from "@/lib/api";

export const getSummary = () => api.get("/hr-overview/summary");
export const getAttendanceByDepartment = () => api.get("/hr-overview/attendance-by-department");
export const getHeadcountByDepartment = () => api.get("/hr-overview/headcount-by-department");
export const getPendingLeaves = () => api.get("/hr-overview/pending-leaves");