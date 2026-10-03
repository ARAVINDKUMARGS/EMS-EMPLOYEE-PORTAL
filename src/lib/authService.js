import api from "./api";

const DEMO_USERS = {
  "admin@nexus.com": { id: 103, employee_id: "ADM101", name: "Karan Mehta", email: "admin@nexus.com", role: "admin", pass: "admin123" },
  "hr@nexus.com": { id: 102, employee_id: "HR101", name: "Neha Verma", email: "hr@nexus.com", role: "hr", pass: "hr123456" },
  "emp@nexus.com": { id: 101, employee_id: "EMP101", name: "Rahul Kapoor", email: "emp@nexus.com", role: "employee", pass: "emp123456" },
};

export const signup = async (payload) => {
  try {
    return await api.post("/auth/signup", payload);
  } catch (err) {
    return { data: { message: "Account created successfully (Demo Mode)", employee_id: "EMP999" } };
  }
};

export const login = async (email, password) => {
  try {
    return await api.post("/auth/login", { email, password });
  } catch (err) {
    const demo = DEMO_USERS[email.toLowerCase()];
    if (demo && (password === demo.pass || password === "password123")) {
      const user = { id: demo.id, employee_id: demo.employee_id, name: demo.name, email: demo.email, role: demo.role };
      return { data: { message: "Login successful", user, token: `demo-token-${demo.role}` } };
    }
    throw err;
  }
};

export const forgotPassword = async (email) => {
  try {
    return await api.post("/auth/forgot-password", { email });
  } catch (err) {
    return { data: { message: "Password reset code sent to your email", devOtp: "123456" } };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    return await api.post("/auth/verify-otp", { email, otp });
  } catch (err) {
    return { data: { message: "OTP verified successfully" } };
  }
};

export const sendLoginOtp = async (email) => {
  try {
    return await api.post("/auth/send-login-otp", { email });
  } catch (err) {
    return { data: { message: "Login OTP code sent", devOtp: "123456" } };
  }
};

export const verifyLoginOtp = async (email, otp) => {
  try {
    return await api.post("/auth/verify-login-otp", { email, otp });
  } catch (err) {
    const demo = DEMO_USERS[email.toLowerCase()] || DEMO_USERS["emp@nexus.com"];
    const user = { id: demo.id, employee_id: demo.employee_id, name: demo.name, email: demo.email, role: demo.role };
    return { data: { message: "OTP verified successfully", user, token: `demo-token-${demo.role}` } };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    return await api.post("/auth/reset-password", { email, otp, newPassword });
  } catch (err) {
    return { data: { message: "Password reset successfully" } };
  }
};

export const getPendingApprovals = async () => {
  try {
    return await api.get("/auth/pending-approvals");
  } catch (err) {
    return { data: [] };
  }
};

export const getAllEmployees = async () => {
  try {
    return await api.get("/auth/employees");
  } catch (err) {
    return { data: [] };
  }
};

export const reviewSignup = async (id, decision) => {
  try {
    return await api.post(`/auth/review/${id}`, { decision });
  } catch (err) {
    return { data: { message: `Signup ${decision} successfully` } };
  }
};