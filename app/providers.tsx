"use client"

import type React from "react"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { store, persistor } from "@/lib/store"
import { useAppSelector } from "@/lib/hooks"
import { CircularProgress, Box } from "@mui/material"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { ErrorBoundary } from "@/components/error-boundary"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector((state) => state.ui.theme)

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress />
      <div>Loading...</div>
    </Box>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingFallback />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ThemeWrapper>
              <NotificationProvider>{children}</NotificationProvider>
            </ThemeWrapper>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  )
}
