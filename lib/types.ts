// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phoneNumber: string[];
  education?: string;
  address?: string;
  supervisor?: string;
  joinDate?: string;
  createdAt?: string;
  lastLogin?: string;
  status?: "active" | "inactive" | "on_leave";
}

// Leave types
export type LeaveType = "annualLeave" | "sickLeave" | "casualLeave";

export interface LeaveBalance {
  annualLeave: {
    total: number;
    used: number;
    remaining: number;
  };
  sickLeave: {
    total: number;
    used: number;
    remaining: number;
  };
  casualLeave: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  supervisor?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface CurrentLeave {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LeaveBalanceResponse
  extends ApiResponse<{
    leaveBalance: LeaveBalance;
  }> {}

export interface LeaveRequestResponse
  extends ApiResponse<{
    leaveRequest: LeaveRequest;
    currentBalance?: LeaveBalance;
  }> {}

export interface LeaveHistoryResponse
  extends ApiResponse<{
    requests: LeaveRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {}

// Admin types
export interface UserListResponse
  extends ApiResponse<{
    users?: User[];
    data?: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {}

export interface UserResponse
  extends ApiResponse<{
    user: User;
  }> {}

export interface UserLeaveBalance {
  userId: string;
  userName: string;
  userEmail: string;
  supervisor?: string;
  balance: LeaveBalance;
}

export interface AllLeaveBalancesResponse
  extends ApiResponse<{
    leaves: UserLeaveBalance[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {}

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
  leaveDistributionBySupervisor: {
    [supervisor: string]: number;
  };
  monthlyLeaveDistribution: {
    month: string;
    count: number;
  }[];
}

export interface LeaveStatisticsResponse
  extends ApiResponse<{
    statistics: LeaveStatistics;
  }> {}

export interface LeaveBalanceAdjustment {
  annualLeave?: number;
  sickLeave?: number;
  casualLeave?: number;
  reason?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string[];
  education: string;
  address: string;
  supervisor: string;
}

export interface LeaveRequestFormData {
  leaveType: LeaveType;
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

// UI types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// Error types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  data?: any;
}
