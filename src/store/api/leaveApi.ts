// api/leaveApi.ts - Leave management API functions
import api from "@/utils/api";
import { ApiResponse } from "@/types/api.types";

// Define leave-related types (add these to your types files)
interface LeaveBalance {
  annualLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  casualLeave: { total: number; used: number; remaining: number };
  lastUpdated: string;
}

interface LeaveRequest {
  leaveType: "annualLeave" | "sickLeave" | "casualLeave";
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
}

interface LeaveHistory {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  appliedDate: string;
  approvedDate?: string;
  approvedBy?: string;
}

export const leaveApi = {
  // Employee leave APIs
  getLeaveBalance: () =>
    api.get<ApiResponse<{ leaveBalance: LeaveBalance }>>("/api/leave/balance"),

  requestLeave: (leaveData: LeaveRequest) =>
    api.post<
      ApiResponse<{ leaveRequest: LeaveHistory; currentBalance: LeaveBalance }>
    >("/api/leave/request", leaveData),

  getLeaveHistory: (params?: { page?: number; limit?: number }) =>
    api.get<
      ApiResponse<{
        requests: LeaveHistory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>
    >("/api/leave/history", { params }),

  cancelLeaveRequest: (requestId: string) =>
    api.post<ApiResponse>(`/api/leave/cancel/${requestId}`),

  // Admin leave APIs
  getAllLeaveBalances: (params?: {
    page?: number;
    limit?: number;
    supervisor?: string;
  }) =>
    api.get<
      ApiResponse<{
        leaves: Array<{
          userId: string;
          name: string;
          email: string;
          supervisor: string;
          leaveBalance: LeaveBalance;
        }>;
        pagination: {
          currentPage: number;
          totalPages: number;
          totalUsers: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>
    >("/api/leave/admin/all", { params }),

  resetLeaveBalance: (
    userId: string,
    balanceData: {
      annualLeave?: number;
      sickLeave?: number;
      casualLeave?: number;
    }
  ) =>
    api.put<
      ApiResponse<{
        userId: string;
        leaveBalance: LeaveBalance;
      }>
    >(`/api/leave/admin/${userId}/reset`, balanceData),

  adjustLeaveBalance: (
    userId: string,
    adjustmentData: {
      leaveType: "annualLeave" | "sickLeave" | "casualLeave";
      adjustment: number;
      reason: string;
    }
  ) =>
    api.patch<
      ApiResponse<{
        userId: string;
        leaveType: string;
        oldBalance: number;
        adjustment: number;
        newBalance: number;
        reason: string;
      }>
    >(`/api/leave/admin/${userId}/adjust`, adjustmentData),

  getLeaveStatistics: () =>
    api.get<
      ApiResponse<{
        statistics: {
          totalUsers: number;
          usersOnLeave: number;
          averageLeaveUsage: {
            annualLeave: number;
            sickLeave: number;
            casualLeave: number;
          };
          leaveDistributionByType: {
            annualLeave: number;
            sickLeave: number;
            casualLeave: number;
          };
          leaveDistributionBySupervisor: Record<string, number>;
          monthlyLeaveDistribution: Array<{
            month: string;
            count: number;
          }>;
        };
      }>
    >("/api/leave/statistics"),
};
