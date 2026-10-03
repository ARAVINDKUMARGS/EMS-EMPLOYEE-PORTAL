import { useSyncExternalStore } from "react";
const KEY = "nexus.role";
const AUTH_KEY = "nexus.authed";
const USER_KEY = "nexus.user";
const TOKEN_KEY = "nexus.token";
const listeners = /* @__PURE__ */ new Set();
function read() {
  if (typeof window === "undefined") return "employee";
  const v = window.localStorage.getItem(KEY);
  return v === "hr" || v === "admin" ? v : "employee";
}
function setRole(role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, role);
  window.localStorage.setItem(AUTH_KEY, "1");
  listeners.forEach((l) => l());
}
function getRole() {
  return read();
}
function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}
function setSession(user, token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(TOKEN_KEY, token);
  setRole(user.role);
}
let cachedUser;
let cachedUserRaw;

function getUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (raw === cachedUserRaw) {
    return cachedUser;
  }
  cachedUserRaw = raw;
  cachedUser = raw ? JSON.parse(raw) : null;
  return cachedUser;
}
function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  listeners.forEach((l) => l());
}
function useRole() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "employee"
  );
}
function useUser() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getUser,
    () => null
  );
}
const roleLabels = {
  employee: "Employee",
  hr: "HR Manager",
  admin: "Administrator"
};
export {
  getRole,
  getToken,
  getUser,
  isAuthenticated,
  logout,
  roleLabels,
  setRole,
  setSession,
  useRole,
  useUser
};