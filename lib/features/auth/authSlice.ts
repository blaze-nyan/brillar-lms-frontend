import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  phoneNumber: string[]
  education?: string
  address?: string
  supervisor?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role }: { email: string; password: string; role: "admin" | "user" }) => {
    const endpoint = role === "admin" ? "/api/auth/admin/login" : "/api/auth/user/login"
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    return response.json()
  },
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: {
    name: string
    email: string
    password: string
    phoneNumber: string[]
    education: string
    address: string
    supervisor: string
  }) => {
    const response = await fetch("/api/auth/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    return response.json()
  },
)

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  const response = await fetch("/api/auth/user/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.auth.refreshToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Token refresh failed")
  }

  return response.json()
})

export const logout = createAsyncThunk("auth/logout", async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  await fetch("/api/auth/user/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true

        // Store tokens in localStorage
        localStorage.setItem("accessToken", action.payload.accessToken)
        localStorage.setItem("refreshToken", action.payload.refreshToken)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Login failed"
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true

        // Store tokens in localStorage
        localStorage.setItem("accessToken", action.payload.accessToken)
        localStorage.setItem("refreshToken", action.payload.refreshToken)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Registration failed"
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        localStorage.setItem("accessToken", action.payload.accessToken)
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      })
  },
})

export const { clearError, setTokens } = authSlice.actions
export default authSlice.reducer
