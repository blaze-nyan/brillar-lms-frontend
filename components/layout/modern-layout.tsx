"use client";

import * as React from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import {
  AppProvider,
  type Navigation,
  type Router,
} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { toggleTheme } from "@/lib/features/ui/uiSlice";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  window?: () => Window;
}

export function ModernDashboardLayout({
  children,
  window,
}: ModernDashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { theme: currentTheme, notifications } = useAppSelector(
    (state) => state.ui
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isAdmin = user?.role === "admin";
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Define navigation based on user role
  const adminNavigation: Navigation = [
    {
      kind: "header",
      title: "Main",
    },
    {
      segment: "admin-dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "admin-dashboard/users",
      title: "Users Management",
      icon: <PeopleIcon />,
    },
    {
      segment: "admin-dashboard/leave-management",
      title: "Leave Management",
      icon: <EventNoteIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Analytics",
    },
    {
      segment: "admin-dashboard/statistics",
      title: "Statistics",
      icon: <BarChartIcon />,
    },
    {
      segment: "admin-dashboard/reports",
      title: "Reports",
      icon: <AssignmentIcon />,
      children: [
        {
          segment: "leave-summary",
          title: "Leave Summary",
        },
        {
          segment: "employee-analytics",
          title: "Employee Analytics",
        },
      ],
    },
  ];

  const userNavigation: Navigation = [
    {
      kind: "header",
      title: "Main",
    },
    {
      segment: "user-dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "user-dashboard/leave-balance",
      title: "Leave Balance",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      segment: "user-dashboard/leave-history",
      title: "Leave History",
      icon: <EventNoteIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Account",
    },
    {
      segment: "user-dashboard/profile",
      title: "My Profile",
      icon: <AccountCircleIcon />,
    },
    {
      segment: "user-dashboard/settings",
      title: "Settings",
      icon: <SettingsIcon />,
    },
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  // Create a custom router for Toolpad
  const customRouter: Router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => {
        router.push(typeof path === "string" ? path : path.toString());
      },
    };
  }, [pathname, router]);

  // Create theme based on current theme mode
  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "data-toolpad-color-scheme",
        },
        colorSchemes: {
          light: {
            palette: {
              background: {
                default: "#f5f5f5",
                paper: "#ffffff",
              },
              primary: {
                main: "#1976d2",
              },
              secondary: {
                main: "#dc004e",
              },
            },
          },
          dark: {
            palette: {
              background: {
                default: "#121212",
                paper: "#1e1e1e",
              },
              primary: {
                main: "#90caf9",
              },
              secondary: {
                main: "#f48fb1",
              },
            },
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
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
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                borderRadius: 16,
              },
            },
          },
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
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [currentTheme]
  );

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await dispatch(logout());
    router.push("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    router.push(
      isAdmin ? "/admin-dashboard/profile" : "/user-dashboard/profile"
    );
  };

  // Custom toolbar actions
  const toolbarActions = (
    <>
      <Tooltip title="Toggle theme">
        <IconButton onClick={handleThemeToggle} sx={{ ml: 1 }}>
          {currentTheme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton onClick={handleNotificationClick} sx={{ ml: 1 }}>
          <Badge badgeContent={unreadNotifications} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Help">
        <IconButton sx={{ ml: 1 }}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{ ml: 2 }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: "primary.main",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={navigation}
        router={customRouter}
        theme={theme}
        window={window}
        branding={{
          logo: (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventNoteIcon sx={{ color: "primary.main" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                LMS
              </Typography>
            </Box>
          ),
          title: "Leave Management",
        }}
      >
        <DashboardLayout
          slots={{
            toolbarActions: () => toolbarActions,
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: { xs: 2, sm: 3 },
              minHeight: "100vh",
            }}
          >
            {children}
          </Box>
        </DashboardLayout>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() =>
              router.push(
                isAdmin
                  ? "/admin-dashboard/settings"
                  : "/user-dashboard/settings"
              )
            }
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notification Dropdown */}
        <NotificationDropdown
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
        />
      </AppProvider>
    </ThemeProvider>
  );
}
