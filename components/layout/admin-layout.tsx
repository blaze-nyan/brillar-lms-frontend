"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { toggleSidebar, toggleTheme, setBreadcrumbs } from "@/lib/features/ui/uiSlice"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/admin-dashboard", value: "dashboard" },
  { text: "Users", icon: PeopleIcon, path: "/admin-dashboard/users", value: "users" },
  {
    text: "Leave Management",
    icon: AssignmentIcon,
    path: "/admin-dashboard/leave-management",
    value: "leave-management",
  },
  { text: "Statistics", icon: BarChartIcon, path: "/admin-dashboard/statistics", value: "statistics" },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { sidebarOpen, theme: currentTheme, notifications } = useAppSelector((state) => state.ui)

  const unreadNotifications = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "admin") {
      router.push("/user-dashboard")
      return
    }

    // Set breadcrumbs based on current path
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [
      { label: "Home", href: "/admin-dashboard" },
      ...pathSegments.slice(1).map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
        href: index === pathSegments.length - 2 ? undefined : `/${pathSegments.slice(0, index + 2).join("/")}`,
      })),
    ]
    dispatch(setBreadcrumbs(breadcrumbs))
  }, [isAuthenticated, user, router, pathname, dispatch])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = async () => {
    await dispatch(logout())
    router.push("/login")
  }

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar())
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      dispatch(toggleSidebar())
    }
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              selected={pathname === item.path || pathname.startsWith(item.path + "/")}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Leave Management System
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentTheme === "dark"}
                  onChange={handleThemeToggle}
                  icon={<Brightness7 />}
                  checkedIcon={<Brightness4 />}
                />
              }
              label=""
              sx={{ mr: 1 }}
            />

            <IconButton color="inherit" onClick={handleNotificationMenu}>
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, mr: 1 }}>
              {user.name}
            </Typography>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: sidebarOpen ? drawerWidth : 0 },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              color="inherit"
              onClick={() => router.push("/admin-dashboard")}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            {pathname !== "/admin-dashboard" &&
              pathname
                .split("/")
                .slice(2)
                .map((segment, index, array) => {
                  const isLast = index === array.length - 1
                  const href = `/admin-dashboard/${array.slice(0, index + 1).join("/")}`
                  const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ")

                  return isLast ? (
                    <Typography key={segment} color="text.primary">
                      {label}
                    </Typography>
                  ) : (
                    <Link
                      key={segment}
                      underline="hover"
                      color="inherit"
                      onClick={() => router.push(href)}
                      sx={{ cursor: "pointer" }}
                    >
                      {label}
                    </Link>
                  )
                })}
          </Breadcrumbs>

          {children}
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <AccountCircle sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notification Dropdown */}
      <NotificationDropdown
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
      />
    </Box>
  )
}
