import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type {
  User,
  UserListResponse,
  UserResponse,
  UserLeaveBalance,
  AllLeaveBalancesResponse,
  LeaveStatistics,
  LeaveBalanceAdjustment,
} from "@/lib/types"

interface AdminState {
  users: User[]
  usersPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  selectedUser: User | null
  userLeaveBalances: UserLeaveBalance[]
  leaveBalancesPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  leaveStatistics: LeaveStatistics | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  successMessage: string | null
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
  leaveStatistics: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
}

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params: { page?: number; limit?: number; supervisor?: string; search?: string } = {}, { getState }) => {
    const state = getState() as { auth: { accessToken: string } }
    const { page = 1, limit = 10, supervisor = "", search = "" } = params

    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())
    if (supervisor) queryParams.append("supervisor", supervisor)
    if (search) queryParams.append("search", search)

    const response = await fetch(`/api/auth/user/admin/all?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    const data: UserListResponse = await response.json()
    return data
  },
)

export const fetchUserById = createAsyncThunk("admin/fetchUserById", async (userId: string, { getState }) => {
  const state = getState() as { auth: { accessToken: string } }
  const response = await fetch(`/api/auth/user/admin/${userId}`, {
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  const data: UserResponse = await response.json()
  return data.data
})

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, userData }: { userId: string; userData: Partial<User> }, { getState }) => {
    const state = getState() as { auth: { accessToken: string } }
    const response = await fetch(`/api/auth/user/admin/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update user")
    }

    const data: UserResponse = await response.json()
    return data
  },
)

export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId: string, { getState }) => {
  const state = getState() as { auth: { accessToken: string } }
  const response = await fetch(`/api/auth/user/admin/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete user")
  }

  return userId
})

export const fetchAllLeaveBalances = createAsyncThunk(
  "admin/fetchAllLeaveBalances",
  async (params: { page?: number; limit?: number; supervisor?: string; search?: string } = {}, { getState }) => {
    const state = getState() as { auth: { accessToken: string } }
    const { page = 1, limit = 10, supervisor = "", search = "" } = params

    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())
    if (supervisor) queryParams.append("supervisor", supervisor)
    if (search) queryParams.append("search", search)

    const response = await fetch(`/api/leave/admin/all?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch leave balances")
    }

    const data: AllLeaveBalancesResponse = await response.json()
    return data
  },
)

export const resetLeaveBalance = createAsyncThunk("admin/resetLeaveBalance", async (userId: string, { getState }) => {
  const state = getState() as { auth: { accessToken: string } }
  const response = await fetch(`/api/leave/admin/${userId}/reset`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to reset leave balance")
  }

  const data = await response.json()
  return { userId, balance: data.data }
})

export const adjustLeaveBalance = createAsyncThunk(
  "admin/adjustLeaveBalance",
  async ({ userId, adjustment }: { userId: string; adjustment: LeaveBalanceAdjustment }, { getState }) => {
    const state = getState() as { auth: { accessToken: string } }
    const response = await fetch(`/api/leave/admin/${userId}/adjust`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
      body: JSON.stringify(adjustment),
    })

    if (!response.ok) {
      throw new Error("Failed to adjust leave balance")
    }

    const data = await response.json()
    return { userId, balance: data.data }
  },
)

export const fetchLeaveStatistics = createAsyncThunk("admin/fetchLeaveStatistics", async (_, { getState }) => {
  const state = getState() as { auth: { accessToken: string } }
  const response = await fetch("/api/leave/statistics", {
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch leave statistics")
  }

  const data = await response.json()
  return data.data
})

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.data
        state.usersPagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch user"
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isSubmitting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.successMessage = "User updated successfully"
        state.selectedUser = action.payload.data

        // Update user in the list
        const index = state.users.findIndex((user) => user.id === action.payload.data.id)
        if (index !== -1) {
          state.users[index] = action.payload.data
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.error.message || "Failed to update user"
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isSubmitting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.successMessage = "User deleted successfully"
        state.users = state.users.filter((user) => user.id !== action.payload)
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.error.message || "Failed to delete user"
      })
      // Fetch all leave balances
      .addCase(fetchAllLeaveBalances.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllLeaveBalances.fulfilled, (state, action) => {
        state.isLoading = false
        state.userLeaveBalances = action.payload.data
        state.leaveBalancesPagination = action.payload.pagination
      })
      .addCase(fetchAllLeaveBalances.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch leave balances"
      })
      // Reset leave balance
      .addCase(resetLeaveBalance.pending, (state) => {
        state.isSubmitting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(resetLeaveBalance.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.successMessage = "Leave balance reset successfully"

        // Update the balance in the list
        const index = state.userLeaveBalances.findIndex((item) => item.userId === action.payload.userId)
        if (index !== -1) {
          state.userLeaveBalances[index].balance = action.payload.balance
        }
      })
      .addCase(resetLeaveBalance.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.error.message || "Failed to reset leave balance"
      })
      // Adjust leave balance
      .addCase(adjustLeaveBalance.pending, (state) => {
        state.isSubmitting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(adjustLeaveBalance.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.successMessage = "Leave balance adjusted successfully"

        // Update the balance in the list
        const index = state.userLeaveBalances.findIndex((item) => item.userId === action.payload.userId)
        if (index !== -1) {
          state.userLeaveBalances[index].balance = action.payload.balance
        }
      })
      .addCase(adjustLeaveBalance.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.error.message || "Failed to adjust leave balance"
      })
      // Fetch leave statistics
      .addCase(fetchLeaveStatistics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLeaveStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.leaveStatistics = action.payload
      })
      .addCase(fetchLeaveStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch leave statistics"
      })
  },
})

export const { clearError, clearSuccessMessage, setSelectedUser } = adminSlice.actions
export default adminSlice.reducer
