import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  User,
  Admin,
  LoginCredentials,
  RegisterData,
} from "@/types/auth.types";
import { authApi } from "../api/authApi";

interface AuthState {
  user: User | null;
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: "user" | "admin" | null;
}

// Helper functions for localStorage
const getStoredAuth = () => {
  try {
    // Check if using individual keys or combined auth object
    const authObject = localStorage.getItem("auth");
    if (authObject) {
      return JSON.parse(authObject);
    }

    // Fallback to individual keys
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      return {
        accessToken,
        refreshToken,
        // You'll need to determine role from token or store it separately
        role: "admin", // or decode from JWT
        isAuthenticated: true,
      };
    }

    return null;
  } catch {
    return null;
  }
};

const saveAuthToStorage = (authData: Partial<AuthState>) => {
  try {
    localStorage.setItem("auth", JSON.stringify(authData));
  } catch {
    // Ignore localStorage errors
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem("auth");
  } catch {
    // Ignore localStorage errors
  }
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  user: storedAuth?.user || null,
  admin: storedAuth?.admin || null,
  accessToken: storedAuth?.accessToken || null,
  refreshToken: storedAuth?.refreshToken || null,
  isAuthenticated: !!storedAuth?.accessToken,
  isLoading: false,
  error: null,
  role: storedAuth?.role || null,
};

// Async thunks with any type casting
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await (authApi as any).loginUser(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await (authApi as any).loginAdmin(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await (authApi as any).registerUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      // Fix: Use refreshUserToken instead of refreshToken
      const response = await (authApi as any).refreshUserToken(refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      await (authApi as any).logout(refreshToken);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
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
    },
    clearAuth: (state) => {
      state.user = null;
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;

      // Clear from localStorage
      clearAuthFromStorage();
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any
        const payload = action.payload as any;
        state.user = payload.data?.user || null;
        state.accessToken = payload.data?.accessToken || null;
        state.refreshToken = payload.data?.refreshToken || null;
        state.isAuthenticated = true;
        state.role = "user";

        // Save to localStorage
        saveAuthToStorage({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login Admin
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any
        const payload = action.payload as any;
        state.admin = payload.data?.admin || null;
        state.accessToken = payload.data?.accessToken || null;
        state.refreshToken = payload.data?.refreshToken || null;
        state.isAuthenticated = true;
        state.role = "admin";

        // Save to localStorage
        saveAuthToStorage({
          admin: state.admin,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
        });
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any
        const payload = action.payload as any;
        state.user = payload.data?.user || null;
        state.accessToken = payload.data?.accessToken || null;
        state.refreshToken = payload.data?.refreshToken || null;
        state.isAuthenticated = true;
        state.role = "user";

        // Save to localStorage
        saveAuthToStorage({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
      // Type cast payload to any
      const payload = action.payload as any;
      state.accessToken = payload.data?.accessToken || null;
      state.refreshToken = payload.data?.refreshToken || null;

      // Update localStorage
      const currentAuth = getStoredAuth();
      if (currentAuth) {
        saveAuthToStorage({
          ...currentAuth,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        });
      }
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;

      // Clear from localStorage
      clearAuthFromStorage();
    });
  },
});

export const { clearError, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
