import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { LeaveBalance, LeaveRequest, CurrentLeave, LeaveType } from "@/lib/types"

interface LeaveState {
  balance: LeaveBalance | null
  currentLeave: CurrentLeave | null
  leaveHistory: LeaveRequest[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  successMessage: string | null
}

const initialState: LeaveState = {
  balance: null,
  currentLeave: null,
  leaveHistory: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
}

// Async thunks for API calls
export const fetchLeaveBalance = createAsyncThunk("leave/fetchBalance", async (_, { getState }) => {
  const state = getState() as { auth: { accessToken: string } }
  const response = await fetch("/api/leave/balance", {
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch leave balance")
  }

  const data = await response.json()
  return data.data
})

export const submitLeaveRequest = createAsyncThunk(
  "leave/submitRequest",
  async (
    requestData: {
      leaveType: LeaveType
      startDate: string
      endDate: string
      days: number
      reason: string
    },
    { getState },
  ) => {
    const state = getState() as { auth: { accessToken: string } }
    const response = await fetch("/api/leave/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to submit leave request")
    }

    const data = await response.json()
    return data
  },
)

export const fetchLeaveHistory = createAsyncThunk(
  "leave/fetchHistory",
  async (params: { page?: number; limit?: number } = {}, { getState }) => {
    const state = getState() as { auth: { accessToken: string } }
    const { page = 1, limit = 10 } = params

    const response = await fetch(`/api/leave/history?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${state.auth.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch leave history")
    }

    const data = await response.json()
    return data.data
  },
)

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    setCurrentLeave: (state, action: PayloadAction<CurrentLeave | null>) => {
      state.currentLeave = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leave balance
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch leave balance"
      })
      // Submit leave request
      .addCase(submitLeaveRequest.pending, (state) => {
        state.isSubmitting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.successMessage = action.payload.message || "Leave request submitted successfully"
        // Add the new request to history
        state.leaveHistory.unshift(action.payload.data)
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.error.message || "Failed to submit leave request"
      })
      // Fetch leave history
      .addCase(fetchLeaveHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.leaveHistory = action.payload
      })
      .addCase(fetchLeaveHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch leave history"
      })
  },
})

export const { clearError, clearSuccessMessage, setCurrentLeave } = leaveSlice.actions
export default leaveSlice.reducer
