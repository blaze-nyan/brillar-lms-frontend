import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phoneNumber: string[];
  education?: string;
  address?: string;
  supervisor?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

// Helper to get tokens from localStorage
const getStoredTokens = () => {
  if (typeof window === "undefined")
    return { accessToken: null, refreshToken: null };

  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
};

// Helper to store tokens
const storeTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// Helper to clear tokens
const clearTokens = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Async thunks for API calls
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    const { accessToken, refreshToken } = getStoredTokens();

    if (accessToken && refreshToken) {
      try {
        // Try to get user profile to validate token
        const profileResponse = await authAPI.getUserProfile(accessToken);

        return {
          user: profileResponse.data.user,
          accessToken,
          refreshToken,
        };
      } catch (error) {
        // Token might be expired, try to refresh
        try {
          const refreshResponse = await authAPI.refreshToken(refreshToken);
          const newAccessToken = refreshResponse.data.accessToken;
          const newRefreshToken =
            refreshResponse.data.refreshToken || refreshToken;

          storeTokens(newAccessToken, newRefreshToken);

          const profileResponse = await authAPI.getUserProfile(newAccessToken);

          return {
            user: profileResponse.data.user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          };
        } catch (refreshError) {
          // Refresh failed, clear tokens
          clearTokens();
          throw new Error("Authentication expired");
        }
      }
    }

    throw new Error("No stored authentication");
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: "admin" | "user";
  }) => {
    const response =
      role === "admin"
        ? await authAPI.adminLogin(email, password)
        : await authAPI.userLogin(email, password);

    const { accessToken, refreshToken } = response.data;
    storeTokens(accessToken, refreshToken);

    return response;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string[];
    education: string;
    address: string;
    supervisor: string;
  }) => {
    const response = await authAPI.userRegister(userData);

    const { accessToken, refreshToken } = response.data;
    storeTokens(accessToken, refreshToken);

    return response;
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };

    if (!state.auth.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await authAPI.refreshToken(state.auth.refreshToken);

    const { accessToken, refreshToken } = response.data;
    const newRefreshToken = refreshToken || state.auth.refreshToken;

    storeTokens(accessToken, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };

    try {
      if (state.auth.accessToken) {
        await authAPI.logout(
          state.auth.accessToken,
          state.auth.refreshToken || undefined
        );
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      clearTokens();
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: Partial<User>, { getState }) => {
    const state = getState() as { auth: AuthState };

    if (!state.auth.accessToken || !state.auth.user) {
      throw new Error("Not authenticated");
    }

    // This would need to be implemented in your backend
    const response = (await authAPI.updateUserProfile?.(
      state.auth.accessToken,
      profileData
    )) || { data: { user: { ...state.auth.user, ...profileData } } };

    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      storeTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // Handle both admin and user responses
        const responseData = action.payload.data;
        const user = responseData.admin || responseData.user;

        // Ensure role is set correctly
        if (responseData.admin) {
          user.role = "admin";
        } else if (responseData.user) {
          user.role = "user";
        }

        state.user = user;
        state.accessToken = responseData.accessToken;
        state.refreshToken = responseData.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
        state.isAuthenticated = false;
      })
      // Refresh token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        // Refresh failed, clear auth
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        clearTokens();
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload.data.user };
        }
      });
  },
});

export const { clearError, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
