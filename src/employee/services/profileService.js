import api from "@/lib/api";

export const getProfile = (employeeId) => api.get(`/profile/${employeeId}`);

export const updatePersonal = (employeeId, payload) =>
  api.put(`/profile/${employeeId}/personal`, payload);

export const updateEmployment = (employeeId, payload) =>
  api.put(`/profile/${employeeId}/employment`, payload);

export const getSkills = (employeeId) => api.get(`/profile/${employeeId}/skills`);
export const addSkill = (employeeId, payload) => api.post(`/profile/${employeeId}/skills`, payload);
export const updateSkill = (employeeId, skillId, payload) => api.put(`/profile/${employeeId}/skills/${skillId}`, payload);
export const deleteSkill = (employeeId, skillId) => api.delete(`/profile/${employeeId}/skills/${skillId}`);

export const getEmergencyContacts = (employeeId) => api.get(`/profile/${employeeId}/emergency`);
export const saveEmergencyContacts = (employeeId, payload) => api.put(`/profile/${employeeId}/emergency`, payload);