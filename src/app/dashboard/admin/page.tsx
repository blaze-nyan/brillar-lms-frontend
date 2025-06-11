"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  People as PeopleIcon,
  TimeToLeave as LeaveIcon,
  BarChart as ChartIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getLeaveStatistics } from "@/store/slices/adminSlice";
import Link from "next/link";

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const adminState = useSelector((state: RootState) => state.admin);
  const statistics = (adminState as any)?.statistics;

  useEffect(() => {
    dispatch(getLeaveStatistics());
  }, [dispatch]);

  const adminActions = [
    {
      title: "User Management",
      description: "Manage employees and their profiles",
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      href: "/dashboard/admin/users",
      color: "primary.main",
    },
    {
      title: "Leave Management",
      description: "Manage employee leave balances",
      icon: <LeaveIcon sx={{ fontSize: 48 }} />,
      href: "/dashboard/admin/leave",
      color: "secondary.main",
    },
    {
      title: "Statistics",
      description: "View leave statistics and reports",
      icon: <ChartIcon sx={{ fontSize: 48 }} />,
      href: "/dashboard/admin/statistics",
      color: "info.main",
    },
    {
      title: "Settings",
      description: "System configuration and settings",
      icon: <SettingsIcon sx={{ fontSize: 48 }} />,
      href: "/dashboard/admin/settings",
      color: "warning.main",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Overview */}
      {statistics && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            System Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="primary">
                    {statistics.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="warning.main">
                    {statistics.usersOnLeave}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currently On Leave
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="success.main">
                    {statistics.leaveDistributionByType.annualLeave}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Annual Leave Used
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="error.main">
                    {statistics.leaveDistributionByType.sickLeave}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sick Leave Used
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Admin Actions */}
      <Typography variant="h5" gutterBottom>
        Administration
      </Typography>
      <Grid container spacing={3}>
        {adminActions.map((action) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.title}>
            <Card sx={{ cursor: "pointer", "&:hover": { elevation: 4 } }}>
              <Link href={action.href} style={{ textDecoration: "none" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ color: action.color, mb: 2 }}>{action.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
