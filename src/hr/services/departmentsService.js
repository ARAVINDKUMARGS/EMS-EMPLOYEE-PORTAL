import api from "@/lib/api";

export const getDepartments = () => api.get("/departments");
export const createDepartment = (payload) => api.post("/departments", payload);
export const updateDepartment = (id, payload) => api.put(`/departments/${id}`, payload);