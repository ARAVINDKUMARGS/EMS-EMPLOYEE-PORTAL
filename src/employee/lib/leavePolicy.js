export const LEAVE_POLICY = {
  Annual: { allowance: 20, color: "#3B82F6" },
  Sick: { allowance: 10, color: "#EF4444" },
  Personal: { allowance: 5, color: "#A78BFA" },
  "Comp Off": { allowance: 3, color: "#34D399" },
};

export const leaveTypes = Object.keys(LEAVE_POLICY);

export function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}