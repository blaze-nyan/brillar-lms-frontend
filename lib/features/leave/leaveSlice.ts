import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { leaveAPI } from "@/lib/api";
import type {
  LeaveBalance,
  LeaveRequest,
  CurrentLeave,
  LeaveType,
} from "@/lib/types";

interface LeaveState {
  balance: LeaveBalance | null;
  currentLeave: CurrentLeave | null;
  leaveHistory: LeaveRequest[];
  historyPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: LeaveState = {
  balance: null,
  currentLeave: null,
  leaveHistory: [],
  historyPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
};

// Async thunks for API calls
export const fetchLeaveBalance = createAsyncThunk(
  "leave/fetchBalance",
  async (_, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await leaveAPI.getBalance(state.auth.accessToken);
    return response.data;
  }
);

export const submitLeaveRequest = createAsyncThunk(
  "leave/submitRequest",
  async (
    requestData: {
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      days: number;
      reason: string;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await leaveAPI.requestLeave(
      state.auth.accessToken,
      requestData
    );

    // Refresh leave balance after successful request
    dispatch(fetchLeaveBalance());

    return response;
  }
);

export const fetchLeaveHistory = createAsyncThunk(
  "leave/fetchHistory",
  async (params: { page?: number; limit?: number } = {}, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const { page = 1, limit = 10 } = params;

    // Note: This endpoint needs to be implemented in your backend
    try {
      const response = await leaveAPI.getLeaveHistory?.(
        state.auth.accessToken,
        { page, limit }
      );
      return response.data;
    } catch (error) {
      // Fallback to mock data for now
      console.warn("Leave history endpoint not implemented, using mock data");
      return {
        requests: [
          {
            id: "1",
            userId: state.auth.user?.id || "",
            leaveType: "annualLeave" as LeaveType,
            startDate: "2024-01-15",
            endDate: "2024-01-17",
            days: 3,
            reason: "Family vacation",
            status: "approved" as const,
            appliedDate: "2024-01-10",
            approvedDate: "2024-01-12",
            approvedBy: "Admin",
          },
          {
            id: "2",
            userId: state.auth.user?.id || "",
            leaveType: "sickLeave" as LeaveType,
            startDate: "2024-02-01",
            endDate: "2024-02-01",
            days: 1,
            reason: "Medical appointment",
            status: "pending" as const,
            appliedDate: "2024-01-30",
          },
        ] as LeaveRequest[],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };
    }
  }
);

export const cancelLeaveRequest = createAsyncThunk(
  "leave/cancelRequest",
  async (requestId: string, { getState, dispatch }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    // This endpoint needs to be implemented in your backend
    try {
      const response = await leaveAPI.cancelLeaveRequest?.(
        state.auth.accessToken,
        requestId
      );

      // Refresh leave balance and history after cancellation
      dispatch(fetchLeaveBalance());
      dispatch(fetchLeaveHistory());

      return response;
    } catch (error) {
      throw new Error("Cancel leave request endpoint not implemented");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentLeave: (state, action: PayloadAction<CurrentLeave | null>) => {
      state.currentLeave = action.payload;
    },
    updateLeaveBalance: (state, action: PayloadAction<LeaveBalance>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leave balance
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.leaveBalance || action.payload;
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch leave balance";
      })
      // Submit leave request
      .addCase(submitLeaveRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage =
          action.payload.message || "Leave request submitted successfully";

        // Add the new request to history if it exists
        if (action.payload.data?.leaveRequest) {
          state.leaveHistory.unshift(action.payload.data.leaveRequest);
        }

        // Update balance if provided
        if (action.payload.data?.currentBalance) {
          state.balance = action.payload.data.currentBalance;
        }
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to submit leave request";
      })
      // Fetch leave history
      .addCase(fetchLeaveHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveHistory = action.payload.requests || action.payload;
        state.historyPagination =
          action.payload.pagination || state.historyPagination;
      })
      .addCase(fetchLeaveHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch leave history";
      })
      // Cancel leave request
      .addCase(cancelLeaveRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(cancelLeaveRequest.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = "Leave request cancelled successfully";
      })
      .addCase(cancelLeaveRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to cancel leave request";
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentLeave,
  updateLeaveBalance,
} = leaveSlice.actions;
export default leaveSlice.reducer;
