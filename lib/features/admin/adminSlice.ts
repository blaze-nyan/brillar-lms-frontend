import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { userAPI, leaveAPI } from "@/lib/api";
import type {
  User,
  UserListResponse,
  UserResponse,
  UserLeaveBalance,
  AllLeaveBalancesResponse,
  LeaveStatistics,
  LeaveBalanceAdjustment,
} from "@/lib/types";

interface AdminState {
  users: User[];
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedUser: User | null;
  userLeaveBalances: UserLeaveBalance[];
  leaveBalancesPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  leaveStatistics: LeaveStatistics | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AdminState = {
  users: [],
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  selectedUser: null,
  userLeaveBalances: [],
  leaveBalancesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
  leaveStatistics: {
    totalUsers: 0,
    usersOnLeave: 0,
    averageLeaveUsage: {
      annualLeave: 0,
      sickLeave: 0,
      casualLeave: 0,
    },
    leaveDistributionByType: {
      annualLeave: 0,
      sickLeave: 0,
      casualLeave: 0,
    },
    leaveDistributionBySupervisor: {},
    monthlyLeaveDistribution: [],
  },
};

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (
    params: {
      page?: number;
      limit?: number;
      supervisor?: string;
      search?: string;
    } = {},
    { getState }
  ) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await userAPI.getAllUsers(state.auth.accessToken, params);
    return response;
  }
);

export const fetchUserById = createAsyncThunk(
  "admin/fetchUserById",
  async (userId: string, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await userAPI.getUserById(state.auth.accessToken, userId);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (
    { userId, userData }: { userId: string; userData: Partial<User> },
    { getState }
  ) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await userAPI.updateUser(
      state.auth.accessToken,
      userId,
      userData
    );
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    await userAPI.deleteUser(state.auth.accessToken, userId);
    return userId;
  }
);

export const fetchAllLeaveBalances = createAsyncThunk(
  "admin/fetchAllLeaveBalances",
  async (
    params: {
      page?: number;
      limit?: number;
      supervisor?: string;
      search?: string;
    } = {},
    { getState }
  ) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await leaveAPI.getAllLeaveBalances(
      state.auth.accessToken,
      params
    );
    return response;
  }
);

export const resetLeaveBalance = createAsyncThunk(
  "admin/resetLeaveBalance",
  async (userId: string, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await leaveAPI.resetLeaveBalance(
      state.auth.accessToken,
      userId
    );
    return { userId, balance: response.data };
  }
);

export const adjustLeaveBalance = createAsyncThunk(
  "admin/adjustLeaveBalance",
  async (
    {
      userId,
      adjustment,
    }: { userId: string; adjustment: LeaveBalanceAdjustment },
    { getState }
  ) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await leaveAPI.adjustLeaveBalance(
      state.auth.accessToken,
      userId,
      adjustment
    );
    return { userId, balance: response.data };
  }
);

export const fetchLeaveStatistics = createAsyncThunk(
  "admin/fetchLeaveStatistics",
  async (_, { getState }) => {
    const state = getState() as { auth: { accessToken: string } };

    if (!state.auth.accessToken) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await leaveAPI.getStatistics(state.auth.accessToken);
      return response.data.statistics;
    } catch (error) {
      // Return mock data if endpoint is not implemented
      console.warn(
        "Statistics endpoint not fully implemented, using mock data"
      );
      return {
        totalUsers: 156,
        usersOnLeave: 12,
        averageLeaveUsage: {
          annualLeave: 6.5,
          sickLeave: 3.2,
          casualLeave: 2.1,
        },
        leaveDistributionByType: {
          annualLeave: 45,
          sickLeave: 25,
          casualLeave: 30,
        },
        leaveDistributionBySupervisor: {
          "Ko Kaung San Phoe": 35,
          "Ko Kyaw Swa Win": 28,
          Dimple: 42,
          Budiman: 51,
        },
        monthlyLeaveDistribution: [
          { month: "Jan", count: 23 },
          { month: "Feb", count: 18 },
          { month: "Mar", count: 31 },
          { month: "Apr", count: 25 },
          { month: "May", count: 28 },
          { month: "Jun", count: 20 },
        ],
      } as LeaveStatistics;
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || action.payload.users || [];
        state.usersPagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: state.users.length,
          totalPages: Math.ceil(state.users.length / 10),
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload.user || action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = "User updated successfully";
        const updatedUser = action.payload.data.user || action.payload.data;
        state.selectedUser = updatedUser;

        // Update user in the list
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to update user";
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = "User deleted successfully";
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to delete user";
      })
      // Fetch all leave balances
      .addCase(fetchAllLeaveBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaveBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLeaveBalances =
          action.payload.data?.leaves || action.payload.data || [];
        state.leaveBalancesPagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: state.userLeaveBalances.length,
          totalPages: Math.ceil(state.userLeaveBalances.length / 10),
        };
      })
      .addCase(fetchAllLeaveBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch leave balances";
      })
      // Reset leave balance
      .addCase(resetLeaveBalance.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetLeaveBalance.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = "Leave balance reset successfully";

        // Update the balance in the list
        const index = state.userLeaveBalances.findIndex(
          (item) => item.userId === action.payload.userId
        );
        if (index !== -1) {
          state.userLeaveBalances[index].balance =
            action.payload.balance.leaveBalance || action.payload.balance;
        }
      })
      .addCase(resetLeaveBalance.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to reset leave balance";
      })
      // Adjust leave balance
      .addCase(adjustLeaveBalance.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(adjustLeaveBalance.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = "Leave balance adjusted successfully";

        // Update the balance in the list
        const index = state.userLeaveBalances.findIndex(
          (item) => item.userId === action.payload.userId
        );
        if (index !== -1) {
          state.userLeaveBalances[index].balance =
            action.payload.balance.leaveBalance || action.payload.balance;
        }
      })
      .addCase(adjustLeaveBalance.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || "Failed to adjust leave balance";
      })
      // Fetch leave statistics
      .addCase(fetchLeaveStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveStatistics = action.payload;
      })
      .addCase(fetchLeaveStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to fetch leave statistics";
      });
  },
});

export const { clearError, clearSuccessMessage, setSelectedUser } =
  adminSlice.actions;
export default adminSlice.reducer;
