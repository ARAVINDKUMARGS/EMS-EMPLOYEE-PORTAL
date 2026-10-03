import api from "@/lib/api";

export const checkIn = (employee_id) =>
  api.post("/attendance/checkin", { employee_id });

export const checkOut = (employee_id) =>
  api.post("/attendance/checkout", { employee_id });

export const updateBreak = (employeeId, breakSeconds) =>
  api.put(`/attendance/break`, {
    employee_id: employeeId,
    break_seconds: breakSeconds,
  });

export const getToday = (employee_id) =>
  api.get(`/attendance/today/${employee_id}`);

export const getHistory = (employee_id) =>
  api.get(`/attendance/history/${employee_id}`);

export const getCalendar = (employeeId, month, year) => {
  return api.get(`/attendance/calendar/${employeeId}?month=${month}&year=${year}`);
};

export const getSummary = (employeeId) =>
  api.get(`/attendance/summary/${employeeId}`);