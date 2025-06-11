export interface LeaveRecord {
  id: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string[];
  education: string;
  address: string;
  supervisor: string;
  createdAt: string;
  updatedAt?: string;
  leave?: LeaveRecord;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string[];
  education: string;
  address: string;
  supervisor: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user?: User;
    admin?: Admin;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
