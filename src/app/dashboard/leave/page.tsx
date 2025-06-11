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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getLeaveBalance } from "@/store/slices/leaveSlice";
import { LEAVE_TYPES } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";

const LeavePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaveBalance, isLoading } = useSelector(
    (state: RootState) => state.leave
  ) as {
    leaveBalance: any;
    isLoading: boolean;
  };

  useEffect(() => {
    dispatch(getLeaveBalance());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ cursor: "pointer", "&:hover": { elevation: 4 } }}>
            <Link
              href="/dashboard/leave/request"
              style={{ textDecoration: "none" }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Request Leave
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit a new leave request
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ cursor: "pointer", "&:hover": { elevation: 4 } }}>
            <Link
              href="/dashboard/leave/history"
              style={{ textDecoration: "none" }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <HistoryIcon
                  sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Leave History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your leave requests
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <CalendarIcon sx={{ fontSize: 48, color: "info.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Leave Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View leave calendar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Balance Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Leave Balance Overview
        </Typography>

        {leaveBalance && (
          <Grid container spacing={3}>
            {Object.entries(LEAVE_TYPES).map(([key, label]) => {
              const balance = leaveBalance[key as keyof typeof LEAVE_TYPES];
              return (
                <Grid size={{ xs: 12, md: 4 }} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {label}
                      </Typography>
                      <Typography variant="h3" color="primary" gutterBottom>
                        {balance?.remaining || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        days remaining out of {balance?.total || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Used: {balance?.used || 0} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {/* Current Leave Status */}
      {leaveBalance?.currentLeave?.startDate && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Current Leave Status
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip label="Currently On Leave" color="warning" />
            <Typography variant="h6">
              {
                LEAVE_TYPES[
                  leaveBalance.currentLeave.type as keyof typeof LEAVE_TYPES
                ]
              }
            </Typography>
          </Box>
          <Typography variant="body1">
            From {formatDate(leaveBalance.currentLeave.startDate)} to{" "}
            {formatDate(leaveBalance.currentLeave.endDate || "")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {leaveBalance.currentLeave.days} days
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LeavePage;
