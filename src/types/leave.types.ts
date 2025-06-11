export interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRecord {
  _id: string;
  userId: string;
  annualLeave: LeaveBalance;
  sickLeave: LeaveBalance;
  casualLeave: LeaveBalance;
  currentLeave: {
    startDate: string | null;
    endDate: string | null;
    type: string | null;
    days: number;
  };
  history: LeaveHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaveHistoryItem {
  _id: string;
  leaveType: "annualLeave" | "sickLeave" | "casualLeave";
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  appliedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface LeaveRequest {
  leaveType: "annualLeave" | "sickLeave" | "casualLeave";
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
}

export interface LeaveStatistics {
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
}
