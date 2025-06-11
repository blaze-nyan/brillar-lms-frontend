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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getLeaveHistory } from "@/store/slices/leaveSlice";
import { LEAVE_TYPES, LEAVE_STATUS } from "@/utils/constants";
import { formatDate, getStatusColor } from "@/utils/formatters";
import { LeaveHistoryItem } from "@/types/leave.types";

export const LeaveHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { leaveHistory, isLoading } = useSelector(
    (state: RootState) => state.leave
  ) as {
    leaveHistory: any[];
    isLoading: boolean;
  };

  const [page, setPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState<LeaveHistoryItem | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(!isMobile);

  useEffect(() => {
    dispatch(getLeaveHistory({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleViewDetails = (leave: LeaveHistoryItem) => {
    setSelectedLeave(leave);
  };

  const handleCloseDetails = () => {
    setSelectedLeave(null);
  };

  const filteredHistory = leaveHistory.filter((item) => {
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    const typeMatch = typeFilter === "all" || item.leaveType === typeFilter;
    return statusMatch && typeMatch;
  });

  const activeFiltersCount = [statusFilter, typeFilter].filter(
    (filter) => filter !== "all"
  ).length;

  // Mobile Card Component
  const MobileLeaveCard = ({ leave }: { leave: LeaveHistoryItem }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Leave Type and Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {LEAVE_TYPES[leave.leaveType as keyof typeof LEAVE_TYPES]}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {leave.days} {leave.days === 1 ? "day" : "days"}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={LEAVE_STATUS[leave.status as keyof typeof LEAVE_STATUS]}
            sx={{
              bgcolor: getStatusColor(leave.status),
              color: "white",
              fontWeight: "bold",
            }}
            size="small"
          />
        </Box>

        {/* Date Range */}
        <Box
          sx={{
            p: 2,

            borderRadius: 1,
            mb: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                Start Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {formatDate(leave.startDate)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                End Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {formatDate(leave.endDate)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Applied Date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Applied on {formatDate(leave.appliedDate)}
          </Typography>
        </Box>

        {/* Reason Preview */}
        {leave.reason && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              Reason
            </Typography>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {leave.reason}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => handleViewDetails(leave)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
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
          Loading leave history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <HistoryIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              Leave History
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              View and track your leave requests
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Filters Section */}
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

            {/* Filter Controls */}
            {showFilters && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      {Object.entries(LEAVE_STATUS).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label="Type"
                      onChange={(e) => setTypeFilter(e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      {Object.entries(LEAVE_TYPES).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Button
                      fullWidth
                      variant="text"
                      color="error"
                      onClick={() => {
                        setStatusFilter("all");
                        setTypeFilter("all");
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <Box>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((leave) => (
                  <MobileLeaveCard key={leave._id} leave={leave} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <HistoryIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No leave requests found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or submit a new leave request
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
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center">Days</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((leave) => (
                    <TableRow
                      key={leave._id}
                      sx={{
                        // "&:hover": { bgcolor: "grey.50" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {
                            LEAVE_TYPES[
                              leave.leaveType as keyof typeof LEAVE_TYPES
                            ]
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(leave.startDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(leave.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${leave.days} ${leave.days === 1 ? "day" : "days"}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            LEAVE_STATUS[
                              leave.status as keyof typeof LEAVE_STATUS
                            ]
                          }
                          sx={{
                            bgcolor: getStatusColor(leave.status),
                            color: "white",
                            fontWeight: "bold",
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(leave.appliedDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(leave)}
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            // "&:hover": { bgcolor: "primary.50" },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Empty State for Desktop */}
          {!isMobile && filteredHistory.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <HistoryIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No leave requests found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or submit a new leave request
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {filteredHistory.length > 0 && (
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "center", sm: "center" },
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredHistory.length} requests
              </Typography>
              <Pagination
                count={Math.ceil(filteredHistory.length / 10)}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Leave Details Modal */}
      <Dialog
        open={Boolean(selectedLeave)}
        onClose={handleCloseDetails}
        maxWidth="md"
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
            Leave Request Details
          </Typography>
          {isMobile && (
            <IconButton
              onClick={handleCloseDetails}
              sx={{ color: "white" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {selectedLeave && (
            <Box sx={{ pt: 1 }}>
              {/* Employee Info Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  p: 2,

                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 50,
                    height: 50,
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {
                      LEAVE_TYPES[
                        selectedLeave.leaveType as keyof typeof LEAVE_TYPES
                      ]
                    }
                  </Typography>
                  <Chip
                    label={
                      LEAVE_STATUS[
                        selectedLeave.status as keyof typeof LEAVE_STATUS
                      ]
                    }
                    sx={{
                      bgcolor: getStatusColor(selectedLeave.status),
                      color: "white",
                      fontWeight: "bold",
                    }}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Start Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {formatDate(selectedLeave.startDate)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      End Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {formatDate(selectedLeave.endDate)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Total Days
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {selectedLeave.days}{" "}
                      {selectedLeave.days === 1 ? "day" : "days"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Applied Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {formatDate(selectedLeave.appliedDate)}
                    </Typography>
                  </Box>
                </Grid>

                {selectedLeave.reason && (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Reason
                      </Typography>
                      <Typography variant="body1">
                        {selectedLeave.reason}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {selectedLeave.approvedBy && (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "success.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "success.200",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="success.dark"
                        sx={{ mb: 1 }}
                      >
                        Approved By
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {selectedLeave.approvedBy}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {selectedLeave.rejectionReason && (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "error.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "error.200",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="error.dark"
                        sx={{ mb: 1 }}
                      >
                        Rejection Reason
                      </Typography>
                      <Typography variant="body1" color="error.main">
                        {selectedLeave.rejectionReason}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            onClick={handleCloseDetails}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
