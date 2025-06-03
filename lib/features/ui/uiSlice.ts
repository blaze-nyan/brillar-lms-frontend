import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UIState {
  theme: "light" | "dark"
  sidebarOpen: boolean
  notifications: Notification[]
  loading: {
    [key: string]: boolean
  }
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: true,
  notifications: [],
  loading: {},
  breadcrumbs: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      }
      state.notifications.unshift(notification)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  setLoading,
  setBreadcrumbs,
} = uiSlice.actions

export default uiSlice.reducer
