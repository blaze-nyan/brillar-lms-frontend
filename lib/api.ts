const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiCallOptions extends RequestInit {
  token?: string;
}

export async function apiCall(endpoint: string, options: ApiCallOptions = {}) {
  const { token, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || "API Error", data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      0,
      error instanceof Error ? error.message : "Network Error"
    );
  }
}

// Helper functions for common API patterns
export const authAPI = {
  adminLogin: (email: string, password: string) =>
    apiCall("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  userLogin: (email: string, password: string) =>
    apiCall("/api/auth/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  userRegister: (userData: any) =>
    apiCall("/api/auth/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  refreshToken: (refreshToken: string) =>
    apiCall("/api/auth/user/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (token: string, refreshToken?: string) =>
    apiCall("/api/auth/user/logout", {
      method: "POST",
      token,
      body: JSON.stringify({ refreshToken }),
    }),

  getUserProfile: (token: string) =>
    apiCall("/api/auth/user/profile", {
      token,
    }),

  getAdminProfile: (token: string) =>
    apiCall("/api/auth/admin/profile", {
      token,
    }),
};

export const userAPI = {
  getAllUsers: (token: string, params: any = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    return apiCall(`/api/auth/user/admin/all?${queryParams.toString()}`, {
      token,
    });
  },

  getUserById: (token: string, userId: string) =>
    apiCall(`/api/auth/user/admin/${userId}`, { token }),

  updateUser: (token: string, userId: string, userData: any) =>
    apiCall(`/api/auth/user/admin/${userId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(userData),
    }),

  deleteUser: (token: string, userId: string) =>
    apiCall(`/api/auth/user/admin/${userId}`, {
      method: "DELETE",
      token,
    }),

  getSupervisors: () => apiCall("/api/auth/user/supervisors"),
};

export const leaveAPI = {
  getBalance: (token: string) => apiCall("/api/leave/balance", { token }),

  requestLeave: (token: string, leaveData: any) =>
    apiCall("/api/leave/request", {
      method: "POST",
      token,
      body: JSON.stringify(leaveData),
    }),

  getAllLeaveBalances: (token: string, params: any = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    return apiCall(`/api/leave/admin/all?${queryParams.toString()}`, { token });
  },

  resetLeaveBalance: (token: string, userId: string, balanceData?: any) =>
    apiCall(`/api/leave/admin/${userId}/reset`, {
      method: "PUT",
      token,
      body: JSON.stringify(balanceData || {}),
    }),

  adjustLeaveBalance: (token: string, userId: string, adjustmentData: any) =>
    apiCall(`/api/leave/admin/${userId}/adjust`, {
      method: "PATCH",
      token,
      body: JSON.stringify(adjustmentData),
    }),

  getStatistics: (token: string) => apiCall("/api/leave/statistics", { token }),
};
