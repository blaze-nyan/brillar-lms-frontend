import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/auth.types";
import { userApi } from "../api/userApi";
import { RootState } from "@/store";

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const getAdminProfile = createAsyncThunk(
  "user/getAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAdminProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin profile"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      // Type cast auth to any to access role property
      const { role } = (state.auth as any);

      let response;
      if (role === "admin") {
        response = await userApi.getAdminProfile(); // ✅ Correct - calls /auth/admin/profile
      } else {
        response = await userApi.getProfile(); // ✅ Correct - calls /auth/user/profile
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Profile (Unified)
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (payload.data) {
          state.profile =
            (payload.data as any).user ||
            (payload.data as any).admin ||
            payload.data;
        } else {
          state.profile = null;
        }
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get User Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (payload.data) {
          state.profile = (payload.data as any).user || payload.data;
        } else {
          state.profile = null;
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Admin Profile
    builder
      .addCase(getAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (payload.data) {
          state.profile = (payload.data as any).admin || payload.data;
        } else {
          state.profile = null;
        }
        state.error = null;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (payload.data) {
          state.profile = (payload.data as any).user || payload.data;
        } else {
          state.profile = null;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
