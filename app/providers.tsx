"use client";

import type React from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { store, persistor } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CircularProgress, Box } from "@mui/material";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { initializeAuth } from "@/lib/features/auth/authSlice";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
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
        <div>Initializing...</div>
      </Box>
    );
  }

  return <>{children}</>;
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector((state) => state.ui.theme);

  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: {
      light: {
        palette: {
          mode: "light",
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
          },
          secondary: {
            main: "#dc004e",
            light: "#e33371",
            dark: "#9a0036",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          success: {
            main: "#2e7d32",
            light: "#4caf50",
            dark: "#1b5e20",
          },
          warning: {
            main: "#ed6c02",
            light: "#ff9800",
            dark: "#e65100",
          },
          error: {
            main: "#d32f2f",
            light: "#ef5350",
            dark: "#c62828",
          },
          info: {
            main: "#0288d1",
            light: "#03a9f4",
            dark: "#01579b",
          },
        },
      },
      dark: {
        palette: {
          mode: "dark",
          primary: {
            main: "#90caf9",
            light: "#e3f2fd",
            dark: "#42a5f5",
          },
          secondary: {
            main: "#f48fb1",
            light: "#ffc1e3",
            dark: "#bf5f82",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          success: {
            main: "#66bb6a",
            light: "#81c784",
            dark: "#388e3c",
          },
          warning: {
            main: "#ffa726",
            light: "#ffb74d",
            dark: "#f57c00",
          },
          error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
          },
          info: {
            main: "#29b6f6",
            light: "#4fc3f7",
            dark: "#0288d1",
          },
        },
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
            padding: "8px 16px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
            borderRadius: 16,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow:
              "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.08)",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow:
              "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 500,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(145, 158, 171, 0.08)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgba(145, 158, 171, 0.04)",
              borderBottom: "1px solid rgba(145, 158, 171, 0.08)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid rgba(145, 158, 171, 0.08)",
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: "1px solid rgba(145, 158, 171, 0.08)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "1px solid rgba(145, 158, 171, 0.08)",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
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
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AppRouterCacheProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingFallback />} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeWrapper>
                  <AuthInitializer>
                    <NotificationProvider>{children}</NotificationProvider>
                  </AuthInitializer>
                </ThemeWrapper>
              </LocalizationProvider>
              {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </AppRouterCacheProvider>
    </ErrorBoundary>
  );
}
