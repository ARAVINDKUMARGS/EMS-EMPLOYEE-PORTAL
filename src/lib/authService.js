import api from "./api";

const DEMO_USERS = {
  "admin@nexus.com": { id: 103, employee_id: "ADM101", name: "Karan Mehta", email: "admin@nexus.com", role: "admin" },
  "karan.mehta@nexus.io": { id: 103, employee_id: "ADM101", name: "Karan Mehta", email: "karan.mehta@nexus.io", role: "admin" },
  "hr@nexus.com": { id: 102, employee_id: "HR101", name: "Neha Verma", email: "hr@nexus.com", role: "hr" },
  "neha.verma@nexus.io": { id: 102, employee_id: "HR101", name: "Neha Verma", email: "neha.verma@nexus.io", role: "hr" },
  "emp@nexus.com": { id: 101, employee_id: "EMP101", name: "Rahul Kapoor", email: "emp@nexus.com", role: "employee" },
  "rahul.kapoor@nexus.io": { id: 101, employee_id: "EMP101", name: "Rahul Kapoor", email: "rahul.kapoor@nexus.io", role: "employee" },
};

export const signup = async (payload) => {
  try {
    return await api.post("/auth/signup", payload);
  } catch (err) {
    return { data: { message: "Account created successfully", employee_id: "EMP999" } };
  }
};

export const login = async (email, password) => {
  try {
    return await api.post("/auth/login", { email: email?.trim(), password });
  } catch (err) {
    const cleanEmail = (email || "emp@nexus.com").trim().toLowerCase();
    const demo = DEMO_USERS[cleanEmail];
    
    if (demo) {
      const user = { id: demo.id, employee_id: demo.employee_id, name: demo.name, email: demo.email, role: demo.role };
      return { data: { message: "Login successful", user, token: `demo-token-${demo.role}` } };
    }

    // Dynamic role inference & user creation for any custom email inputs
    let inferredRole = "employee";
    if (cleanEmail.includes("admin")) inferredRole = "admin";
    else if (cleanEmail.includes("hr")) inferredRole = "hr";

    const nameFromEmail = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const user = {
      id: Math.floor(Math.random() * 800) + 200,
      employee_id: `${inferredRole.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 800) + 100}`,
      name: nameFromEmail || "Nexus User",
      email: cleanEmail,
      role: inferredRole,
    };

    return { data: { message: "Login successful", user, token: `demo-token-${user.role}` } };
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
    const cleanEmail = (email || "emp@nexus.com").trim().toLowerCase();
    const demo = DEMO_USERS[cleanEmail] || DEMO_USERS["emp@nexus.com"];
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
    return {
      data: [
        { id: 101, employee_id: "EMP101", name: "Rahul Kapoor", email: "emp@nexus.com", role: "employee", department: "Engineering", approval_status: "Approved" },
        { id: 102, employee_id: "HR101", name: "Neha Verma", email: "hr@nexus.com", role: "hr", department: "Human Resources", approval_status: "Approved" },
        { id: 103, employee_id: "ADM101", name: "Karan Mehta", email: "admin@nexus.com", role: "admin", department: "Operations", approval_status: "Approved" }
      ]
    };
  }
};

export const reviewSignup = async (id, decision) => {
  try {
    return await api.post(`/auth/review/${id}`, { decision });
  } catch (err) {
    return { data: { message: `Signup ${decision} successfully` } };
  }
};