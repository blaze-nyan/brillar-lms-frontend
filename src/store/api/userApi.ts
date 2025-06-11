import api from "@/utils/api";
import { User } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";

export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>("/api/auth/user/profile"),
  getAdminProfile: () =>
    api.get<ApiResponse<{ admin: User }>>("/api/auth/admin/profile"),
  getUserProfile: () => api.get("/api/auth/user/profile"),

  updateProfile: (userData: Partial<User>) =>
    api.put<ApiResponse<{ user: User }>>("/api/auth/user/profile", userData),

  getSupervisors: () =>
    api.get<
      ApiResponse<{ supervisors: Array<{ name: string; userCount: number }> }>
    >("/api/auth/user/supervisors"),
};
