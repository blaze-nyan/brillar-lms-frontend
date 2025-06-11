"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
  Avatar,
  Divider,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  TimeToLeave as LeaveIcon,
  Email as EmailIcon,
  SupervisorAccount as SupervisorIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getAllLeaveBalances } from "@/store/slices/adminSlice";
import { SUPERVISORS } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";

export const LeaveManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { leaveBalances, isLoading, pagination } = useSelector(
    (state: RootState) => state.admin
  ) as {
    leaveBalances: any[];
    isLoading: boolean;
    pagination: any;
  };

  const [page, setPage] = useState(1);
  const [supervisor, setSupervisor] = useState("");
  const [resetDialog, setResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [resetValues, setResetValues] = useState({
    annualLeave: 10,
    sickLeave: 14,
    casualLeave: 5,
  });

  useEffect(() => {
    dispatch(getAllLeaveBalances({ page, limit: 10, supervisor }));
  }, [dispatch, page, supervisor]);

  const handleResetLeave = (user: any) => {
    setSelectedUser(user);
    setResetValues({
      annualLeave: user.leaveBalance?.annualLeave?.total || 10,
      sickLeave: user.leaveBalance?.sickLeave?.total || 14,
      casualLeave: user.leaveBalance?.casualLeave?.total || 5,
    });
    setResetDialog(true);
  };

  const handleConfirmReset = () => {
    // TODO: Implement reset leave balance API call
    console.log("Reset leave for user:", selectedUser, resetValues);
    setResetDialog(false);
    setSelectedUser(null);
  };

  const activeFiltersCount = [supervisor].filter(Boolean).length;

  // Calculate progress percentage
  const getProgressPercentage = (used: number, total: number) => {
    return total > 0 ? (used / total) * 100 : 0;
  };

  // Get color based on usage percentage
  const getUsageColor = (used: number, total: number) => {
    const percentage = getProgressPercentage(used, total);
    if (percentage >= 80) return "error";
    if (percentage >= 60) return "warning";
    return "success";
  };

  // Mobile Card View for Leave Balances
  const MobileLeaveCard = ({ leave }: { leave: any }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Employee Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "primary.main",
              flexShrink: 0,
            }}
          >
            {leave.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {leave.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {leave.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SupervisorIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Chip
                label={leave.supervisor}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Leave Balances */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Leave Balances
        </Typography>

        <Stack spacing={2}>
          {[
            {
              type: "Annual Leave",
              data: leave.leaveBalance?.annualLeave,
              color: "success",
              icon: "🏖️",
            },
            {
              type: "Sick Leave",
              data: leave.leaveBalance?.sickLeave,
              color: "error",
              icon: "🏥",
            },
            {
              type: "Casual Leave",
              data: leave.leaveBalance?.casualLeave,
              color: "warning",
              icon: "☕",
            },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                bgcolor: `${item.color}.50`,
                borderRadius: 1,
                border: `1px solid`,
                borderColor: `${item.color}.200`,
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {item.type}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: `${item.color}.main` }}
                >
                  {item.data?.remaining || 0}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Used: {item.data?.used || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total: {item.data?.total || 0}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={getProgressPercentage(
                  item.data?.used || 0,
                  item.data?.total || 0
                )}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "white",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    bgcolor: `${item.color}.main`,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>

        {/* Last Updated */}
        {leave.leaveBalance?.lastUpdated && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 2 }}
          >
            <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatDate(leave.leaveBalance.lastUpdated)}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => handleResetLeave(leave)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Reset Balance
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LeaveIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              Leave Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Manage employee leave balances and settings
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Filters */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Filter Toggle (Mobile) */}
            {isMobile && (
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant={showFilters ? "contained" : "outlined"}
                  startIcon={
                    <Badge badgeContent={activeFiltersCount} color="error">
                      <FilterIcon />
                    </Badge>
                  }
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ borderRadius: 2 }}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </Grid>
            )}

            {/* Supervisor Filter */}
            {showFilters && (
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Supervisor</InputLabel>
                  <Select
                    value={supervisor}
                    label="Supervisor"
                    onChange={(e) => setSupervisor(e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">All Supervisors</MenuItem>
                    {SUPERVISORS.map((sup) => (
                      <MenuItem key={sup} value={sup}>
                        {sup}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="text"
                  color="error"
                  onClick={() => setSupervisor("")}
                  sx={{ borderRadius: 2 }}
                >
                  Clear Filters
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <Box>
              {leaveBalances.length > 0 ? (
                leaveBalances.map((leave) => (
                  <MobileLeaveCard key={leave.userId} leave={leave} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <LeaveIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No leave records found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            /* Desktop/Tablet View - Table */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: "bold" } }}>
                    <TableCell>Employee</TableCell>
                    <TableCell>Supervisor</TableCell>
                    <TableCell align="center">Annual Leave</TableCell>
                    <TableCell align="center">Sick Leave</TableCell>
                    <TableCell align="center">Casual Leave</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveBalances.map((leave) => (
                    <TableRow
                      key={leave.userId}
                      sx={{
                        // "&:hover": { bgcolor: "grey.50" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "primary.main",
                            }}
                          >
                            {leave.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {leave.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {leave.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.supervisor}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>

                      {/* Leave Balance Cells */}
                      {[
                        { key: "annualLeave", color: "success" },
                        { key: "sickLeave", color: "error" },
                        { key: "casualLeave", color: "warning" },
                      ].map(({ key, color }) => (
                        <TableCell key={key} align="center">
                          <Box sx={{ minWidth: 120 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: "bold",
                                color: `${color}.main`,
                              }}
                            >
                              {leave.leaveBalance?.[key]?.remaining || 0} /{" "}
                              {leave.leaveBalance?.[key]?.total || 0}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Used: {leave.leaveBalance?.[key]?.used || 0}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={getProgressPercentage(
                                leave.leaveBalance?.[key]?.used || 0,
                                leave.leaveBalance?.[key]?.total || 0
                              )}
                              sx={{
                                mt: 0.5,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 2,
                                  bgcolor: `${color}.main`,
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                      ))}

                      <TableCell>
                        <Typography variant="body2">
                          {leave.leaveBalance?.lastUpdated
                            ? formatDate(leave.leaveBalance.lastUpdated)
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Reset Leave Balance">
                          <Button
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={() => handleResetLeave(leave)}
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              "&:hover": { bgcolor: "primary.50" },
                            }}
                          >
                            Reset
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {pagination && leaveBalances.length > 0 && (
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {leaveBalances.length} of {pagination.totalUsers}{" "}
                records
              </Typography>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                <Button
                  size="small"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Reset Leave Dialog */}
      <Dialog
        open={resetDialog}
        onClose={() => setResetDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100%" : "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "white",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ fontWeight: "bold" }}
          >
            Reset Leave Balance
          </Typography>
          {isMobile && (
            <IconButton
              onClick={() => setResetDialog(false)}
              sx={{ color: "white" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "primary.main",
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Set new leave balance values for this employee:
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Annual Leave"
                    type="number"
                    value={resetValues.annualLeave}
                    onChange={(e) =>
                      setResetValues({
                        ...resetValues,
                        annualLeave: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      inputProps: { min: 0, max: 50 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Sick Leave"
                    type="number"
                    value={resetValues.sickLeave}
                    onChange={(e) =>
                      setResetValues({
                        ...resetValues,
                        sickLeave: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      inputProps: { min: 0, max: 50 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Casual Leave"
                    type="number"
                    value={resetValues.casualLeave}
                    onChange={(e) =>
                      setResetValues({
                        ...resetValues,
                        casualLeave: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      inputProps: { min: 0, max: 50 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "warning.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "warning.200",
                }}
              >
                <Typography variant="body2" color="warning.dark">
                  ⚠️ This action will reset the employee's leave balance to the
                  specified values. Any previously used leave will be
                  recalculated.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 }, bgcolor: "grey.50" }}>
          <Button
            onClick={() => setResetDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReset}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Reset Leave Balance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
