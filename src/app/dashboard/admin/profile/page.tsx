"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";

// Define the auth state interface
interface AuthState {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin?: string;
    createdAt?: string;
  };
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin?: string;
    createdAt?: string;
  };
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
  isLoading?: boolean;
  error?: string;
}

const AdminProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  // Get auth state with proper typing
  const authState = useSelector((state: RootState) => state.auth as AuthState);
  const { user, admin, isLoading, error, role } = authState;

  // Use admin data if available, otherwise use user data (for admins logged in as users)
  const adminData = admin || (role === "admin" ? user : null);

  useEffect(() => {
    // If you have an admin profile action, uncomment and use it:
    // if (role === 'admin') {
    //   dispatch(getAdminProfile());
    // }
  }, [dispatch, role]);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      // Clear all tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth");

      // Close dialog
      setLogoutDialogOpen(false);

      // Optional: Call logout API directly without Redux
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await fetch("/api/auth/admin/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ refreshToken }),
          });
        }
      } catch (apiError) {
        console.log("API logout call failed, but continuing with local logout");
      }

      // Redirect to login page
      window.location.href = "/login"; // Force full page reload to clear all state
    } catch (error) {
      console.error("Logout failed:", error);
      // Force clear everything and redirect
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Redirect if not admin
  if (role !== "admin") {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AdminIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ fontWeight: "bold" }}
              >
                Admin Profile
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                System administrator dashboard
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            sx={{
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Profile Info Card */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Admin Info Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: { xs: 2, sm: 3 },
                mb: 3,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  boxShadow: theme.shadows[4],
                }}
              >
                <AdminIcon fontSize="large" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {adminData?.name || "Admin User"}
                </Typography>
                <Chip
                  label="System Administrator"
                  color="primary"
                  icon={<AdminIcon />}
                  sx={{ mb: 2, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  size={isMobile ? "small" : "medium"}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: { sm: "400px" } }}
                >
                  Full system access and management privileges for the Brillar
                  LMS platform
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Profile Details */}
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Profile Information
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,

                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      Full Name
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {adminData?.name || "Not provided"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,

                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      Email Address
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "medium",
                      wordBreak: "break-word",
                    }}
                  >
                    {adminData?.email || "Not provided"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,

                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      Last Login
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {adminData?.lastLogin
                      ? new Date(adminData.lastLogin).toLocaleString()
                      : "Not available"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,

                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      Account Created
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {adminData?.createdAt
                      ? new Date(adminData.createdAt).toLocaleDateString()
                      : "Not available"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,

                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AdminIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      Role
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {adminData?.role || "Administrator"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100%" : "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "error.main",
            color: "white",
            p: { xs: 2, sm: 3 },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ fontWeight: "bold" }}
          >
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <DialogContentText
            sx={{ pt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Are you sure you want to logout from the admin panel? This will end
            your current session and you will need to login again to access
            admin features.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },

            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            onClick={handleLogoutCancel}
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: 2,
              order: { xs: 2, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            autoFocus
            sx={{
              borderRadius: 2,
              order: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProfilePage;
