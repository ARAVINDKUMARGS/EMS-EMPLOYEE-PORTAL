import api from "./api";

export const signup = (payload) => api.post("/auth/signup", payload);

export const login = (email, password) => api.post("/auth/login", { email, password });

export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });

export const verifyOtp = (email, otp) => api.post("/auth/verify-otp", { email, otp });

export const sendLoginOtp = (email) => api.post("/auth/send-login-otp", { email });

export const verifyLoginOtp = (email, otp) => api.post("/auth/verify-login-otp", { email, otp });

export const resetPassword = (email, otp, newPassword) =>
  api.post("/auth/reset-password", { email, otp, newPassword });

export const getPendingApprovals = () => api.get("/auth/pending-approvals");

export const getAllEmployees = () => api.get("/auth/employees");

export const reviewSignup = (id, decision) => api.post(`/auth/review/${id}`, { decision });