// User types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  phoneNumber: string[]
  education?: string
  address?: string
  supervisor?: string
  joinDate?: string
  status?: "active" | "inactive" | "on_leave"
}

// Leave types
export type LeaveType = "annualLeave" | "sickLeave" | "casualLeave"

export interface LeaveBalance {
  annualLeave: {
    total: number
    used: number
    remaining: number
  }
  sickLeave: {
    total: number
    used: number
    remaining: number
  }
  casualLeave: {
    total: number
    used: number
    remaining: number
  }
}

export interface LeaveRequest {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  supervisor?: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
}

export interface CurrentLeave {
  id: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  daysRemaining: number
  totalDays: number
}

// API Response types
export interface LeaveBalanceResponse {
  success: boolean
  data: LeaveBalance
  message?: string
}

export interface LeaveRequestResponse {
  success: boolean
  data: LeaveRequest
  message: string
}

export interface LeaveHistoryResponse {
  success: boolean
  data: LeaveRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Admin types
export interface UserListResponse {
  success: boolean
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserResponse {
  success: boolean
  data: User
  message?: string
}

export interface UserLeaveBalance {
  userId: string
  userName: string
  userEmail: string
  supervisor?: string
  balance: LeaveBalance
}

export interface AllLeaveBalancesResponse {
  success: boolean
  data: UserLeaveBalance[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LeaveStatistics {
  totalUsers: number
  usersOnLeave: number
  averageLeaveUsage: {
    annualLeave: number
    sickLeave: number
    casualLeave: number
  }
  leaveDistributionByType: {
    annualLeave: number
    sickLeave: number
    casualLeave: number
  }
  leaveDistributionBySupervisor: {
    [supervisor: string]: number
  }
  monthlyLeaveDistribution: {
    month: string
    count: number
  }[]
}

export interface LeaveStatisticsResponse {
  success: boolean
  data: LeaveStatistics
}

export interface LeaveBalanceAdjustment {
  annualLeave?: number
  sickLeave?: number
  casualLeave?: number
}
