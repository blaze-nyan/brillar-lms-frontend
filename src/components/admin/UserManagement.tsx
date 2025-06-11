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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Fab,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  SupervisorAccount as SupervisorIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { getAllUsers } from "@/store/slices/adminSlice";
import { SUPERVISORS } from "@/utils/constants";
import { formatDate, formatPhoneNumbers } from "@/utils/formatters";
import { User } from "@/types/auth.types";
import { useDebounce } from "@/hooks/useDebounce";

export const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { users, isLoading, pagination } = useSelector(
    (state: RootState) => state.admin
  ) as {
    users: any[];
    isLoading: boolean;
    pagination: any;
  };

  const [page, setPage] = useState(1);
  const [supervisor, setSupervisor] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(!isMobile);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getAllUsers({ page, limit: 10, supervisor, search: debouncedSearch })
    );
  }, [dispatch, page, supervisor, debouncedSearch]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setViewUserDialog(false);
    setSelectedUser(null);
  };

  const activeFiltersCount = [supervisor, search].filter(Boolean).length;

  // Mobile Card View for Users
  const MobileUserCard = ({ user }: { user: any }) => (
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
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "primary.main",
              flexShrink: 0,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {user.name}
            </Typography>

            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatPhoneNumbers(user.phoneNumber)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SupervisorIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Chip
                  label={user.supervisor}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => handleViewUser(user)}
            variant="outlined"
            color="primary"
          >
            View
          </Button>
          <IconButton size="small" color="error">
            <DeleteIcon />
          </IconButton>
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
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: "bold" }}
        >
          User Management
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Manage employee accounts and information
        </Typography>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Search and Filters */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Bar */}
            <Grid size={{ xs: 12, md: showFilters ? 6 : 8 }}>
              <TextField
                fullWidth
                size="small"
                label="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

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
                  onClick={() => {
                    setSearch("");
                    setSupervisor("");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Clear All
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Users Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <Box>
              {users.length > 0 ? (
                users.map((user) => (
                  <MobileUserCard key={user.id} user={user} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <PersonIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria
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
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Supervisor</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
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
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatPhoneNumbers(user.phoneNumber)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.supervisor}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewUser(user)}
                              color="primary"
                              sx={{
                                "&:hover": { bgcolor: "primary.50" },
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                "&:hover": { bgcolor: "error.50" },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {pagination && users.length > 0 && (
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
                Showing {users.length} of {pagination.totalUsers} users
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

      {/* User Details Dialog */}
      <Dialog
        open={viewUserDialog}
        onClose={handleCloseUserDialog}
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
            User Details
          </Typography>
          {isMobile && (
            <IconButton
              onClick={handleCloseUserDialog}
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
              {/* User Avatar and Basic Info */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: 3,
                  mb: 4,
                  p: 2,

                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: "primary.main",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {selectedUser.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {selectedUser.email}
                  </Typography>
                  <Chip
                    label={selectedUser.supervisor}
                    color="primary"
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Full Name
                    </Typography>
                    <Typography variant="body1">{selectedUser.name}</Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Email Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Phone Numbers
                    </Typography>
                    <Typography variant="body1">
                      {formatPhoneNumbers(selectedUser.phoneNumber)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Supervisor
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.supervisor}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Education
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.education}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.address}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Created Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedUser.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                {selectedUser.updatedAt && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedUser.updatedAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Leave Information */}
                {selectedUser.leave && (
                  <Grid size={{ xs: 12 }}>
                    <Paper
                      sx={{ p: 3, mt: 2, borderRadius: 2, bgcolor: "info.50" }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "info.main" }}
                      >
                        Leave Information
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          {
                            key: "annualLeave",
                            label: "Annual Leave",
                            color: "success",
                          },
                          {
                            key: "sickLeave",
                            label: "Sick Leave",
                            color: "error",
                          },
                          {
                            key: "casualLeave",
                            label: "Casual Leave",
                            color: "warning",
                          },
                        ].map(({ key, label, color }) => {
                          // Type-safe access to leave data
                          const leaveData = selectedUser.leave as any;
                          const leaveInfo = leaveData?.[key] || { remaining: 0, total: 0 };
                          
                          return (
                            <Grid size={{ xs: 12, sm: 4 }} key={key}>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  p: 2,
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {label}
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: "bold",
                                    color: `${color}.main`,
                                  }}
                                >
                                  {leaveInfo.remaining}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  / {leaveInfo.total}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            onClick={handleCloseUserDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
