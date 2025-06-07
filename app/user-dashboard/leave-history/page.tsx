"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { UserLayout } from "@/components/layout/user-layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchLeaveHistory,
  cancelLeaveRequest,
} from "@/lib/features/leave/leaveSlice";
import type { LeaveRequest, LeaveType } from "@/lib/types";

export default function UserLeaveHistoryPage() {
  const dispatch = useAppDispatch();
  const { leaveHistory, historyPagination, isLoading } = useAppSelector(
    (state) => state.leave
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<LeaveType | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaveHistory({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      await dispatch(cancelLeaveRequest(requestId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  const getLeaveTypeLabel = (leaveType: string) => {
    switch (leaveType) {
      case "annualLeave":
        return "Annual Leave";
      case "sickLeave":
        return "Sick Leave";
      case "casualLeave":
        return "Casual Leave";
      default:
        return leaveType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter the leave history based on search and filters
  const filteredHistory = leaveHistory.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLeaveTypeLabel(request.leaveType)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      leaveTypeFilter === "all" || request.leaveType === leaveTypeFilter;
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    const requestStartDate = new Date(request.startDate);
    const matchesDateRange =
      (!startDate || requestStartDate >= startDate) &&
      (!endDate || requestStartDate <= endDate);

    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  return (
    <UserLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Leave History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage your leave requests
            </Typography>
          </Box>

          {/* Main Content */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow:
                "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
            }}
          >
            {/* Search and Filters */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search leave requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant={showFilters ? "contained" : "outlined"}
                      startIcon={<FilterListIcon />}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      Filters
                    </Button>
                    <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                      Export
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Advanced Filters */}
              {showFilters && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        fullWidth
                        label="Leave Type"
                        value={leaveTypeFilter}
                        onChange={(e) =>
                          setLeaveTypeFilter(
                            e.target.value as LeaveType | "all"
                          )
                        }
                        size="small"
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="annualLeave">Annual Leave</MenuItem>
                        <MenuItem value="sickLeave">Sick Leave</MenuItem>
                        <MenuItem value="casualLeave">Casual Leave</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Leave History Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center">Days</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No leave requests found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((request) => (
                        <TableRow key={request.id} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              #{request.id.slice(-6).toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getLeaveTypeLabel(request.leaveType)}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(request.startDate)}</TableCell>
                          <TableCell>{formatDate(request.endDate)}</TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {request.days}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {request.reason}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)
                              }
                              color={getStatusColor(request.status) as any}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {formatDate(request.appliedDate)}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title="View Details">
                                <IconButton size="small">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {request.status === "pending" && (
                                <Tooltip title="Cancel Request">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleCancelRequest(request.id)
                                    }
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </LocalizationProvider>
    </UserLayout>
  );
}
