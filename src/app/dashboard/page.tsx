"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import {
  TimeToLeave as LeaveIcon,
  Person as PersonIcon,
  Add as AddIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getLeaveBalance } from "@/store/slices/leaveSlice";
import { getUserProfile } from "@/store/slices/userSlice";
import { useAuth } from "@/hooks/useAuth";
import { LEAVE_TYPES } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { leaveBalance } = useSelector((state: RootState) => state.leave) as {
    leaveBalance: any;
  };
  const { profile } = useSelector((state: RootState) => state.user) as {
    profile: any;
  };

  useEffect(() => {
    if (role === "user") {
      dispatch(getLeaveBalance());
      dispatch(getUserProfile());
    }
  }, [dispatch, role]);

  const leaveStats = [
    {
      type: "annualLeave",
      label: "Annual Leave",
      total: leaveBalance?.annualLeave?.total || 0,
      used: leaveBalance?.annualLeave?.used || 0,
      remaining: leaveBalance?.annualLeave?.remaining || 0,
      color: "#4caf50",
      bgColor: "rgba(76, 175, 80, 0.1)",
    },
    {
      type: "sickLeave",
      label: "Sick Leave",
      total: leaveBalance?.sickLeave?.total || 0,
      used: leaveBalance?.sickLeave?.used || 0,
      remaining: leaveBalance?.sickLeave?.remaining || 0,
      color: "#f44336",
      bgColor: "rgba(244, 67, 54, 0.1)",
    },
    {
      type: "casualLeave",
      label: "Casual Leave",
      total: leaveBalance?.casualLeave?.total || 0,
      used: leaveBalance?.casualLeave?.used || 0,
      remaining: leaveBalance?.casualLeave?.remaining || 0,
      color: "#ff9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
      {/* Welcome Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: isMobile
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 3 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Avatar
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <PersonIcon fontSize={isMobile ? "large" : "inherit"} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Welcome back, {user?.name || profile?.name || "User"}!
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ opacity: 0.9, mb: 1 }}
            >
              {role === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
            </Typography>
            {profile?.supervisor && (
              <Chip
                label={`Supervisor: ${profile.supervisor}`}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-label": { fontWeight: "medium" },
                }}
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {role === "user" && (
        <>
          {/* Leave Balance Cards */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Leave Balance Overview
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {leaveStats.map((stat) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={stat.type}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: stat.bgColor,
                        }}
                      >
                        <LeaveIcon sx={{ color: stat.color, mr: 1 }} />
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{ fontWeight: "medium" }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2, textAlign: "center" }}>
                        <Typography
                          variant={isMobile ? "h4" : "h3"}
                          sx={{
                            color: stat.color,
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}
                        >
                          {stat.remaining}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          days remaining
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Used: {stat.used}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total: {stat.total}
                        </Typography>
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={
                          stat.total > 0 ? (stat.used / stat.total) * 100 : 0
                        }
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: stat.color,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Current Leave Status */}
          {leaveBalance?.currentLeave?.startDate && (
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Current Leave Status
              </Typography>
              <Card
                sx={{
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "warning.main",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Chip
                      label="On Leave"
                      color="warning"
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                      {
                        LEAVE_TYPES[
                          leaveBalance.currentLeave
                            .type as keyof typeof LEAVE_TYPES
                        ]
                      }
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    From {formatDate(leaveBalance.currentLeave.startDate)} to{" "}
                    {formatDate(leaveBalance.currentLeave.endDate || "")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {leaveBalance.currentLeave.days} days
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Quick Actions */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {[
                {
                  href: "/dashboard/leave/request",
                  icon: AddIcon,
                  title: "Request Leave",
                  description: "Submit a new leave request",
                  color: "primary.main",
                  bgColor: "primary.50",
                },
                {
                  href: "/dashboard/leave/history",
                  icon: HistoryIcon,
                  title: "Leave History",
                  description: "View your leave history",
                  color: "secondary.main",
                  bgColor: "secondary.50",
                },
                {
                  href: "/dashboard/profile",
                  icon: PersonIcon,
                  title: "My Profile",
                  description: "Update your information",
                  color: "info.main",
                  bgColor: "info.50",
                },
              ].map((action, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Link
                      href={action.href}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          p: { xs: 2, sm: 3 },
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            borderRadius: "50%",
                            bgcolor: action.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <action.icon
                            sx={{
                              fontSize: { xs: 32, sm: 40 },
                              color: action.color,
                            }}
                          />
                        </Box>
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: { xs: "none", sm: "block" },
                            fontSize: "0.875rem",
                          }}
                        >
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}

      {role === "admin" && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Admin Quick Actions
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {[
              {
                href: "/dashboard/admin/users",
                icon: PersonIcon,
                title: "Manage Users",
                description: "View and manage employees",
                color: "primary.main",
                bgColor: "primary.50",
              },
              {
                href: "/dashboard/admin/leave",
                icon: LeaveIcon,
                title: "Leave Management",
                description: "Manage employee leaves",
                color: "secondary.main",
                bgColor: "secondary.50",
              },
              {
                href: "/dashboard/admin/statistics",
                icon: AssessmentIcon,
                title: "Statistics",
                description: "View system analytics",
                color: "success.main",
                bgColor: "success.50",
              },
            ].map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <Card
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Link
                    href={action.href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        p: { xs: 2, sm: 3 },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 60, sm: 80 },
                          height: { xs: 60, sm: 80 },
                          borderRadius: "50%",
                          bgcolor: action.bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <action.icon
                          sx={{
                            fontSize: { xs: 32, sm: 40 },
                            color: action.color,
                          }}
                        />
                      </Box>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: { xs: "none", sm: "block" },
                          fontSize: "0.875rem",
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
