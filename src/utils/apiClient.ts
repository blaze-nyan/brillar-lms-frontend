// utils/apiClient.ts - Enhanced API client for your existing setup
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401/403 and we haven't already tried to refresh
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token, logout user
        processQueue(error, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Determine refresh endpoint based on stored auth data
        const authData = localStorage.getItem("auth");
        let role = "user"; // default

        if (authData) {
          try {
            const parsedAuth = JSON.parse(authData);
            role = parsedAuth.role || "user";
          } catch (e) {
            // If parse fails, try to decode token
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
              try {
                const payload = JSON.parse(atob(accessToken.split(".")[1]));
                role = payload.role || "user";
              } catch (e) {
                console.warn(
                  "Could not determine user role, defaulting to user"
                );
              }
            }
          }
        }

        const refreshEndpoint =
          role === "admin"
            ? "/api/auth/admin/refresh"
            : "/api/auth/user/refresh";

        const response = await axios.post(
          `${apiClient.defaults.baseURL}${refreshEndpoint}`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Update tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update auth data in localStorage
        if (authData) {
          try {
            const parsedAuth = JSON.parse(authData);
            parsedAuth.accessToken = accessToken;
            if (newRefreshToken) {
              parsedAuth.refreshToken = newRefreshToken;
            }
            localStorage.setItem("auth", JSON.stringify(parsedAuth));
          } catch (e) {
            console.warn("Could not update auth data in localStorage");
          }
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Refresh failed, logout user
        processQueue(refreshError, null);

        // Clear storage
        localStorage.clear();

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
