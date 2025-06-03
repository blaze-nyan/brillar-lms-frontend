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
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { toggleTheme, setBreadcrumbs } from "@/lib/features/ui/uiSlice"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

interface UserLayoutProps {
  children: React.ReactNode
}

export function UserLayout({ children }: UserLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { theme: currentTheme, notifications } = useAppSelector((state) => state.ui)

  const unreadNotifications = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role === "admin") {
      router.push("/admin-dashboard")
      return
    }

    // Set breadcrumbs based on current path
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [
      { label: "Home", href: "/user-dashboard" },
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

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  if (!user || user.role !== "user") {
    return null
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Box sx={{ p: 3 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              color="inherit"
              onClick={() => router.push("/user-dashboard")}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            {pathname !== "/user-dashboard" &&
              pathname
                .split("/")
                .slice(2)
                .map((segment, index, array) => {
                  const isLast = index === array.length - 1
                  const href = `/user-dashboard/${array.slice(0, index + 1).join("/")}`
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
