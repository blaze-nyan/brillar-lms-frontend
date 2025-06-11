import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/auth.types";
import { LeaveStatistics } from "@/types/leave.types";
import { PaginationQuery } from "@/types/api.types";
import { adminApi } from "../api/adminApi";

interface AdminState {
  users: User[];
  leaveBalances: any[];
  statistics: LeaveStatistics | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

const initialState: AdminState = {
  users: [],
  leaveBalances: [],
  statistics: null,
  isLoading: false,
  error: null,
  pagination: null,
};

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (
    params: PaginationQuery & { supervisor?: string; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getAllUsers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const getLeaveStatistics = createAsyncThunk(
  "admin/getLeaveStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getLeaveStatistics();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

export const getAllLeaveBalances = createAsyncThunk(
  "admin/getAllLeaveBalances",
  async (
    params: PaginationQuery & { supervisor?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getAllLeaveBalances(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave balances"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload.data) {
          state.users = [];
          state.pagination = null;
          return;
        }
        state.users = action.payload.data.users;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Leave Statistics
    builder
      .addCase(getLeaveStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload.data) {
          state.statistics = null;
          return;
        }
        state.statistics = action.payload.data.statistics;
      })
      .addCase(getLeaveStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get All Leave Balances
    builder
      .addCase(getAllLeaveBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllLeaveBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload.data) {
          state.leaveBalances = [];
          state.pagination = null;
          return;
        }
        state.leaveBalances = action.payload.data.leaves;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllLeaveBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
