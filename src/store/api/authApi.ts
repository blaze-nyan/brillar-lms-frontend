// api/authApi.ts - Updated version with admin refresh support
import api from "@/utils/api";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";

export const authApi = {
  loginUser: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>("/api/auth/user/login", credentials),

  loginAdmin: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>("/api/auth/admin/login", credentials),

  registerUser: (userData: RegisterData) =>
    api.post<ApiResponse<AuthResponse>>("/api/auth/user/register", userData),

  // User token refresh
  refreshUserToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/api/auth/user/refresh",
      { refreshToken }
    ),

  // Admin token refresh
  refreshAdminToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/api/auth/admin/refresh",
      { refreshToken }
    ),

  // User logout
  logout: (refreshToken: string) =>
    api.post<ApiResponse>("/api/auth/user/logout", { refreshToken }),

  // Admin logout
  logoutAdmin: (refreshToken: string) =>
    api.post<ApiResponse>("/api/auth/admin/logout", { refreshToken }),

  // Get user profile
  getUserProfile: () =>
    api.get<ApiResponse<{ user: any }>>("/api/auth/user/profile"),

  // Get admin profile
  getAdminProfile: () =>
    api.get<ApiResponse<{ admin: any }>>("/api/auth/admin/profile"),

  // Update user profile
  updateUserProfile: (userData: any) =>
    api.put<ApiResponse<{ user: any }>>("/api/auth/user/profile", userData),
};
