import api from "@/utils/api";
import { User } from "@/types/auth.types";
import { LeaveStatistics } from "@/types/leave.types";
import { ApiResponse, PaginationQuery } from "@/types/api.types";

export const adminApi = {
  getAllUsers: (
    params: PaginationQuery & { supervisor?: string; search?: string }
  ) =>
    api.get<ApiResponse<{ users: User[]; pagination: any }>>(
      "/api/auth/user/admin/all",
      { params }
    ),

  getUserById: (userId: string) =>
    api.get<ApiResponse<{ user: User }>>(`/api/auth/user/admin/${userId}`),

  updateUser: (userId: string, userData: Partial<User>) =>
    api.put<ApiResponse<{ user: User }>>(
      `/api/auth/user/admin/${userId}`,
      userData
    ),

  deleteUser: (userId: string) =>
    api.delete<ApiResponse>(`/api/auth/user/admin/${userId}`),

  getAllLeaveBalances: (params: PaginationQuery & { supervisor?: string }) =>
    api.get<ApiResponse<{ leaves: any[]; pagination: any }>>(
      "/api/leave/admin/all",
      { params }
    ),

  resetLeaveBalance: (
    userId: string,
    balances: { annualLeave?: number; sickLeave?: number; casualLeave?: number }
  ) => api.put<ApiResponse>(`/api/leave/admin/${userId}/reset`, balances),

  adjustLeaveBalance: (
    userId: string,
    adjustment: { leaveType: string; adjustment: number; reason: string }
  ) => api.patch<ApiResponse>(`/api/leave/admin/${userId}/adjust`, adjustment),

  getLeaveStatistics: () =>
    api.get<ApiResponse<{ statistics: LeaveStatistics }>>(
      "/api/leave/statistics"
    ),
};
