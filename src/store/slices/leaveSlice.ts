import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  LeaveRecord,
  LeaveRequest,
  LeaveStatistics,
  LeaveHistoryItem,
} from "@/types/leave.types";
import { leaveApi } from "../api/leaveApi";

interface LeaveState {
  leaveBalance: LeaveRecord | null;
  leaveHistory: LeaveHistoryItem[];
  statistics: LeaveStatistics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaveBalance: null,
  leaveHistory: [],
  statistics: null,
  isLoading: false,
  error: null,
};

export const getLeaveBalance = createAsyncThunk(
  "leave/getLeaveBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getLeaveBalance();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave balance"
      );
    }
  }
);

export const requestLeave = createAsyncThunk(
  "leave/requestLeave",
  async (leaveData: LeaveRequest, { rejectWithValue }) => {
    try {
      const response = await leaveApi.requestLeave(leaveData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request leave"
      );
    }
  }
);

export const getLeaveHistory = createAsyncThunk(
  "leave/getLeaveHistory",
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getLeaveHistory(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave history"
      );
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Leave Balance
    builder
      .addCase(getLeaveBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (!payload.data) {
          state.leaveBalance = null;
          return;
        }
        // Type cast the leaveBalance data to any to resolve type conflicts
        state.leaveBalance = payload.data.leaveBalance as any;
      })
      .addCase(getLeaveBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Request Leave
    builder
      .addCase(requestLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestLeave.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        // Update leave balance after successful request
        if (state.leaveBalance) {
          if (!payload.data) {
            state.leaveBalance = null;
            return;
          }
          // Type cast the currentBalance data to any to resolve type conflicts
          state.leaveBalance = payload.data.currentBalance as any;
        }
      })
      .addCase(requestLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Leave History
    builder
      .addCase(getLeaveHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        // Type cast payload to any to access data properties
        const payload = action.payload as any;
        if (!payload.data) {
          state.leaveHistory = [];
          return;
        }
        // Type cast the requests array to any to resolve type conflicts
        state.leaveHistory = payload.data.requests as any;
      })
      .addCase(getLeaveHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;
