"use client";

import { useEffect } from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  People as PeopleIcon,
  EventBusy as EventBusyIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchLeaveStatistics } from "@/lib/features/admin/adminSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function StatisticsCards() {
  const dispatch = useAppDispatch();
  const { leaveStatistics, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchLeaveStatistics());
  }, [dispatch]);

  // Bar chart options and data
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Leave Distribution",
      },
    },
  };

  const barData = {
    labels:
      leaveStatistics?.monthlyLeaveDistribution?.map((item) => item.month) ||
      [],
    datasets: [
      {
        label: "Leave Requests",
        data:
          leaveStatistics?.monthlyLeaveDistribution?.map(
            (item) => item.count
          ) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  // Pie chart options and data
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Leave Distribution by Type",
      },
    },
  };

  const pieData = {
    labels: ["Annual Leave", "Sick Leave", "Casual Leave"],
    datasets: [
      {
        data: leaveStatistics?.leaveDistributionByType
          ? [
              leaveStatistics.leaveDistributionByType.annualLeave || 0,
              leaveStatistics.leaveDistributionByType.sickLeave || 0,
              leaveStatistics.leaveDistributionByType.casualLeave || 0,
            ]
          : [0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Supervisor pie chart
  const supervisorPieData = {
    labels: leaveStatistics
      ? Object.keys(leaveStatistics.leaveDistributionBySupervisor)
      : [],
    datasets: [
      {
        data: leaveStatistics
          ? Object.values(leaveStatistics.leaveDistributionBySupervisor)
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const supervisorPieOptions = {
    ...pieOptions,
    plugins: {
      ...pieOptions.plugins,
      title: {
        display: true,
        text: "Leave Distribution by Supervisor",
      },
    },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Leave Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              height: "100%",
              borderLeft: "4px solid #1976d2",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(25, 118, 210, 0.1)",
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                mr: 2,
              }}
            >
              <PeopleIcon sx={{ color: "#1976d2", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              {isLoading ? (
                <Skeleton width={60} height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {leaveStatistics?.totalUsers || 0}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Users on Leave Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              height: "100%",
              borderLeft: "4px solid #ed6c02",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(237, 108, 2, 0.1)",
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                mr: 2,
              }}
            >
              <EventBusyIcon sx={{ color: "#ed6c02", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Users on Leave
              </Typography>
              {isLoading ? (
                <Skeleton width={60} height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {leaveStatistics?.usersOnLeave || 0}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Average Annual Leave Usage */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              height: "100%",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                mr: 2,
              }}
            >
              <BarChartIcon sx={{ color: "#2e7d32", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Avg. Annual Leave
              </Typography>
              {isLoading ? (
                <Skeleton width={60} height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {leaveStatistics?.averageLeaveUsage.annualLeave.toFixed(1) ||
                    0}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Average Sick Leave Usage */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              height: "100%",
              borderLeft: "4px solid #9c27b0",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(156, 39, 176, 0.1)",
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                mr: 2,
              }}
            >
              <PieChartIcon sx={{ color: "#9c27b0", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Avg. Sick Leave
              </Typography>
              {isLoading ? (
                <Skeleton width={60} height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {leaveStatistics?.averageLeaveUsage.sickLeave.toFixed(1) || 0}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Leave Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <Bar options={barOptions} data={barData} height="100%" />
            )}
          </Paper>
        </Grid>

        {/* Leave Distribution by Type Chart */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <Pie options={pieOptions} data={pieData} height="100%" />
            )}
          </Paper>
        </Grid>

        {/* Leave Distribution by Supervisor Chart */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <Pie
                options={supervisorPieOptions}
                data={supervisorPieData}
                height="100%"
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
