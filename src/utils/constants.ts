export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const SUPERVISORS = [
  "Ko Kaung San Phoe",
  "Ko Kyaw Swa Win",
  "Dimple",
  "Budiman",
];

export const LEAVE_TYPES = {
  annualLeave: "Annual Leave",
  sickLeave: "Sick Leave",
  casualLeave: "Casual Leave",
} as const;

export const LEAVE_STATUS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  LEAVE: "/dashboard/leave",
  LEAVE_REQUEST: "/dashboard/leave/request",
  LEAVE_HISTORY: "/dashboard/leave/history",
  ADMIN: "/dashboard/admin",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_LEAVE: "/dashboard/admin/leave",
  ADMIN_STATISTICS: "/dashboard/admin/statistics",
  PROFILE: "/dashboard/profile",
} as const;
