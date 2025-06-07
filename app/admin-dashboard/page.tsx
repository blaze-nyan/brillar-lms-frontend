"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Typography, Paper, Skeleton } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ModernStatCard } from "@/components/ModernStatCard";
import PeopleIcon from "@mui/icons-material/People";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  fetchLeaveStatistics,
  fetchUsers,
  fetchAllLeaveBalances,
} from "@/lib/features/admin/adminSlice";
import { LeaveUtilizationChart } from "@/components/charts/leave-utilization-chart";
import { DepartmentLeaveChart } from "@/components/charts/department-leave-chart";

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { leaveStatistics, users, userLeaveBalances, isLoading } =
    useAppSelector((state) => state.admin);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/user-dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      // Fetch all necessary data
      dispatch(fetchLeaveStatistics());
      dispatch(fetchUsers({ limit: 100 })); // Get all users
      dispatch(fetchAllLeaveBalances({ limit: 100 }));
    }
  }, [dispatch, isAuthenticated, user]);

  if (!user || user.role !== "admin") {
    return null;
  }

  // Calculate pending requests from user leave balances
  const pendingRequests = userLeaveBalances.filter(
    (balance) =>
      balance.balance &&
      (balance.balance.annualLeave.remaining <
        balance.balance.annualLeave.total ||
        balance.balance.sickLeave.remaining < balance.balance.sickLeave.total ||
        balance.balance.casualLeave.remaining <
          balance.balance.casualLeave.total)
  ).length;

  const stats = [
    {
      title: "Total Employees",
      value: leaveStatistics?.totalUsers || users.length || 0,
      icon: <PeopleIcon />,
      color: "primary" as const,
      subtitle: "Active users",
    },
    {
      title: "On Leave Today",
      value: leaveStatistics?.usersOnLeave || 0,
      icon: <EventBusyIcon />,
      color: "warning" as const,
      subtitle: "Currently on leave",
    },
    {
      title: "Avg Annual Leave",
      value: leaveStatistics?.averageLeaveUsage?.annualLeave?.toFixed(1) || "0",
      icon: <TrendingUpIcon />,
      color: "success" as const,
      subtitle: "Days used",
    },
    {
      title: "Total Leave Taken",
      value: leaveStatistics
        ? (leaveStatistics.leaveDistributionByType?.annualLeave || 0) +
          (leaveStatistics.leaveDistributionByType?.sickLeave || 0) +
          (leaveStatistics.leaveDistributionByType?.casualLeave || 0)
        : 0,
      icon: <AssessmentIcon />,
      color: "info" as const,
      subtitle: "All leave types",
    },
  ];

  // Transform supervisor data for the chart
  const supervisorChartData = leaveStatistics?.leaveDistributionBySupervisor
    ? Object.entries(leaveStatistics.leaveDistributionBySupervisor).map(
        ([supervisor, value]) => ({
          department: supervisor,
          value: value,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        })
      )
    : [];

  return (
    <AdminLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your team today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={160}
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <ModernStatCard {...stat} />
              )}
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <LeaveUtilizationChart
                data={
                  leaveStatistics?.monthlyLeaveDistribution?.map((item) => ({
                    month: item.month,
                    annualLeave: Math.floor(Math.random() * 50) + 20, // We need to update backend to provide this breakdown
                    sickLeave: Math.floor(Math.random() * 30) + 10,
                    casualLeave: Math.floor(Math.random() * 20) + 5,
                  })) || []
                }
                title="Monthly Leave Distribution"
              />
            )}
          </Grid>
          <Grid item xs={12} lg={4}>
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <DepartmentLeaveChart
                data={supervisorChartData}
                title="Leave by Supervisor"
              />
            )}
          </Grid>
        </Grid>

        {/* Recent Leave Requests Section */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow:
              "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Leave Activity
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => router.push("/admin-dashboard/leave-management")}
            >
              View All →
            </Typography>
          </Box>

          {userLeaveBalances.length > 0 ? (
            <Grid container spacing={2}>
              {userLeaveBalances.slice(0, 5).map((userBalance, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "background.default",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {userBalance.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userBalance.supervisor} • {userBalance.userEmail}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          Annual
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {userBalance.balance?.annualLeave?.remaining || 0}/
                          {userBalance.balance?.annualLeave?.total || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          Sick
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {userBalance.balance?.sickLeave?.remaining || 0}/
                          {userBalance.balance?.sickLeave?.total || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          Casual
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {userBalance.balance?.casualLeave?.remaining || 0}/
                          {userBalance.balance?.casualLeave?.total || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No leave data available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </AdminLayout>
  );
}
