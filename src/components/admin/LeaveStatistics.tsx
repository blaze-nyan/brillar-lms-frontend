"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  TimeToLeave as LeaveIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getLeaveStatistics } from "@/store/slices/adminSlice";

const COLORS = ["#4caf50", "#f44336", "#ff9800", "#2196f3", "#9c27b0"];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`statistics-tabpanel-${index}`}
      aria-labelledby={`statistics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const LeaveStatistics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  const { statistics, isLoading } = useSelector(
    (state: RootState) => state.admin
  ) as {
    statistics: any;
    isLoading: boolean;
  };

  useEffect(() => {
    dispatch(getLeaveStatistics());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading || !statistics) {
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
          Loading statistics...
        </Typography>
      </Box>
    );
  }

  const leaveTypeData = [
    {
      name: "Annual Leave",
      value: statistics.leaveDistributionByType.annualLeave,
      color: COLORS[0],
    },
    {
      name: "Sick Leave",
      value: statistics.leaveDistributionByType.sickLeave,
      color: COLORS[1],
    },
    {
      name: "Casual Leave",
      value: statistics.leaveDistributionByType.casualLeave,
      color: COLORS[2],
    },
  ];

  const supervisorData = Object.entries(
    statistics.leaveDistributionBySupervisor
  ).map(([supervisor, count]) => ({
    supervisor,
    count,
  }));

  const summaryCards = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      icon: PeopleIcon,
      color: "primary.main",
      bgColor: "primary.light",
      iconBg: "primary.50",
    },
    {
      title: "Users On Leave",
      value: statistics.usersOnLeave,
      icon: LeaveIcon,
      color: "warning.main",
      bgColor: "warning.light",
      iconBg: "warning.50",
    },
    {
      title: "Avg Annual Used",
      value: `${statistics.averageLeaveUsage.annualLeave} days`,
      icon: TrendingUpIcon,
      color: "success.main",
      bgColor: "success.light",
      iconBg: "success.50",
    },
    {
      title: "Avg Sick Used",
      value: `${statistics.averageLeaveUsage.sickLeave} days`,
      icon: AssessmentIcon,
      color: "error.main",
      bgColor: "error.light",
      iconBg: "error.50",
    },
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Custom label function for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show percentage if it's significant (>5%)
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Simplified label for mobile
  const renderMobileLabel = ({ percent }: any) => {
    // Only show percentage if it's significant (>5%)
    if (percent < 0.05) return null;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)"
              : "linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AssessmentIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              Leave Statistics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Comprehensive analytics and insights on leave usage
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
        >
          Overview
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {summaryCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: "medium",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          mb: 0.5,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          fontWeight: "bold",
                          color: "text.primary",
                          lineHeight: 1.2,
                          fontSize: { xs: "1.5rem", sm: "2rem" },
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        borderRadius: 2,
                        bgcolor: card.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <card.icon
                        sx={{
                          fontSize: { xs: 20, sm: 24 },
                          color: card.color,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Optional progress indicator or additional info */}
                  {/* <Box
                    sx={{
                      height: 3,
                      width: "100%",
                      bgcolor:
                        theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                      borderRadius: 1.5,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.min(((typeof card.value === "number" ? card.value : 50) / 100) * 100, 100)}%`,
                        bgcolor: card.color,
                        borderRadius: 1.5,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs for Mobile/Tablet */}
      {(isMobile || isTablet) && (
        <Paper sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          >
            <Tab icon={<PieChartIcon />} label="Distribution" />
            <Tab icon={<BarChartIcon />} label="Usage" />
            <Tab icon={<ShowChartIcon />} label="Trends" />
          </Tabs>
        </Paper>
      )}

      {/* Desktop Layout */}
      {!isMobile && !isTablet && (
        <Grid container spacing={3}>
          {/* Leave Type Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                minHeight: 400,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Leave Distribution by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value: any, name: any) => [
                      `${value} days`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {leaveTypeData.map((item, index) => (
                    <Chip
                      key={index}
                      label={`${item.name}: ${item.value} days`}
                      sx={{
                        bgcolor: item.color,
                        color: "white",
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: "0.75rem",
                      }}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Leave by Supervisor */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                minHeight: 400,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Leave Usage by Supervisor
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supervisorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supervisor" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#2196f3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Monthly Trend */}
          <Grid size={{ xs: 12 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Monthly Leave Requests Trend
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={statistics.monthlyLeaveDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#673ab7"
                    strokeWidth={3}
                    dot={{ fill: "#673ab7", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#673ab7", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Average Leave Usage */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Average Leave Usage
              </Typography>
              <Box sx={{ mt: 3 }}>
                {Object.entries(statistics.averageLeaveUsage).map(
                  ([type, value], index) => (
                    <Box key={type} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          {type === "annualLeave"
                            ? "Annual Leave"
                            : type === "sickLeave"
                              ? "Sick Leave"
                              : "Casual Leave"}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {String(value)} days
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(Number(value) / 15) * 100}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "grey.800"
                              : "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 6,
                            bgcolor: COLORS[index],
                          },
                        }}
                      />
                    </Box>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Total Leave Usage */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Total Leave Usage
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    {
                      type: "Annual",
                      value: statistics.leaveDistributionByType.annualLeave,
                    },
                    {
                      type: "Sick",
                      value: statistics.leaveDistributionByType.sickLeave,
                    },
                    {
                      type: "Casual",
                      value: statistics.leaveDistributionByType.casualLeave,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Mobile/Tablet Tabbed Content */}
      {(isMobile || isTablet) && (
        <Paper
          sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
        >
          <TabPanel value={tabValue} index={0}>
            {/* Distribution Tab */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Leave Distribution by Type
                  </Typography>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 280 : 320}
                  >
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={isMobile ? renderMobileLabel : renderCustomLabel}
                        outerRadius={isMobile ? 50 : 70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {leaveTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value: any, name: any) => [
                          `${value} days`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend below chart for mobile */}
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Leave Types
                    </Typography>
                    <Grid container spacing={1}>
                      {leaveTypeData.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: `${item.color}10`,
                              border: `1px solid ${item.color}30`,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: item.color,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "medium",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                flex: 1,
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: item.color,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {item.value} days
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Usage by Supervisor
                  </Typography>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 200 : 250}
                  >
                    <BarChart data={supervisorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="supervisor"
                        fontSize={isMobile ? 10 : 12}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                      />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="count"
                        fill="#2196f3"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Usage Tab */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Average Leave Usage
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(statistics.averageLeaveUsage).map(
                      ([type, value], index) => (
                        <Box key={type} sx={{ mb: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {type === "annualLeave"
                                ? "Annual Leave"
                                : type === "sickLeave"
                                  ? "Sick Leave"
                                  : "Casual Leave"}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {String(value)} days
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(Number(value) / 15) * 100}
                            sx={{
                              height: isMobile ? 8 : 12,
                              borderRadius: isMobile ? 4 : 6,
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "grey.800"
                                  : "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: isMobile ? 4 : 6,
                                bgcolor: COLORS[index],
                              },
                            }}
                          />
                        </Box>
                      )
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Total Leave Usage
                  </Typography>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 200 : 250}
                  >
                    <BarChart
                      data={[
                        {
                          type: "Annual",
                          value: statistics.leaveDistributionByType.annualLeave,
                        },
                        {
                          type: "Sick",
                          value: statistics.leaveDistributionByType.sickLeave,
                        },
                        {
                          type: "Casual",
                          value: statistics.leaveDistributionByType.casualLeave,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        fill="#9c27b0"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Trends Tab */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Monthly Leave Requests Trend
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
                <LineChart data={statistics.monthlyLeaveDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    fontSize={isMobile ? 10 : 12}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                  />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#673ab7"
                    strokeWidth={isMobile ? 2 : 3}
                    dot={{
                      fill: "#673ab7",
                      strokeWidth: 2,
                      r: isMobile ? 4 : 6,
                    }}
                    activeDot={{
                      r: isMobile ? 6 : 8,
                      stroke: "#673ab7",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>
        </Paper>
      )}
    </Box>
  );
};
