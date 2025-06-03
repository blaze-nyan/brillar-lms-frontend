"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material"
import {
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  People,
  Assignment,
  Analytics,
} from "@mui/icons-material"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"

export default function DashboardPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await dispatch(logout())
    router.push("/login")
  }

  if (!user) {
    return null
  }

  const isAdmin = user.role === "admin"

  const adminStats = [
    { title: "Total Employees", value: "156", icon: People, color: "bg-blue-500" },
    { title: "Pending Requests", value: "23", icon: Assignment, color: "bg-orange-500" },
    { title: "Approved Today", value: "8", icon: Analytics, color: "bg-green-500" },
    { title: "Total Departments", value: "12", icon: DashboardIcon, color: "bg-purple-500" },
  ]

  const userStats = [
    { title: "Available Leave Days", value: "18", icon: Assignment, color: "bg-green-500" },
    { title: "Pending Requests", value: "2", icon: Assignment, color: "bg-orange-500" },
    { title: "Approved Requests", value: "5", icon: Analytics, color: "bg-blue-500" },
    { title: "Total Used Days", value: "7", icon: DashboardIcon, color: "bg-red-500" },
  ]

  const stats = isAdmin ? adminStats : userStats

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static" className="bg-white shadow-sm">
        <Toolbar>
          <Typography variant="h6" component="div" className="flex-grow text-gray-800">
            Leave Management System
          </Typography>
          <Box className="flex items-center gap-2">
            <Typography variant="body2" className="text-gray-600 hidden sm:block">
              Welcome, {user.name}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar className="bg-blue-500">{user.name.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
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
                <AccountCircle className="mr-2" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp className="mr-2" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-8">
        <Box className="mb-8">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            {isAdmin ? "Admin Dashboard" : "Employee Dashboard"}
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {isAdmin
              ? "Manage leave requests and employee data"
              : "Manage your leave requests and view your leave balance"}
          </Typography>
        </Box>

        <Grid container spacing={3} className="mb-8">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center p-6">
                  <Box className={`p-3 rounded-lg ${stat.color} mr-4`}>
                    <stat.icon className="text-white text-2xl" />
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" className="font-bold text-gray-800">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {stat.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className="p-6">
              <Typography variant="h6" component="h2" className="font-semibold mb-4">
                {isAdmin ? "Recent Leave Requests" : "Your Recent Requests"}
              </Typography>
              <Box className="text-center py-8">
                <Typography variant="body1" className="text-gray-500 mb-4">
                  No recent requests to display
                </Typography>
                <Button variant="contained" className="bg-blue-600 hover:bg-blue-700">
                  {isAdmin ? "View All Requests" : "Submit New Request"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="p-6">
              <Typography variant="h6" component="h2" className="font-semibold mb-4">
                Quick Actions
              </Typography>
              <Box className="space-y-3">
                {isAdmin ? (
                  <>
                    <Button fullWidth variant="outlined" className="justify-start">
                      View All Employees
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      Pending Approvals
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      Generate Reports
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      System Settings
                    </Button>
                  </>
                ) : (
                  <>
                    <Button fullWidth variant="outlined" className="justify-start">
                      Apply for Leave
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      View Leave History
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      Update Profile
                    </Button>
                    <Button fullWidth variant="outlined" className="justify-start">
                      Leave Calendar
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
