import api from "@/lib/api";

export const getMyDocuments = () => api.get("/documents");

export const getEmployeeDocuments = (employeeId) => api.get(`/documents/employee/${employeeId}`);

export const uploadDocument = (formData) =>
  api.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export const FILE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";