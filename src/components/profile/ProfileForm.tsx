"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  SupervisorAccount as SupervisorIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import {
  getUserProfile,
  updateUserProfile,
  getAdminProfile,
  getProfile,
} from "@/store/slices/userSlice";
import { logout } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatPhoneNumbers } from "@/utils/formatters";
import { profileUpdateValidationSchema } from "@/utils/validation";

interface ProfileFormValues {
  name: string;
  phoneNumber: string[];
  education: string;
  address: string;
}

export const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.user
  ) as {
    profile: any;
    isLoading: boolean;
    error: string | null;
  };

  const { user, clearTokens } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { role } = useSelector((state: RootState) => state.auth) as {
    role: "user" | "admin" | null;
  };

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await dispatch(logout(refreshToken));
      }
      clearTokens();
      setLogoutDialogOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      clearTokens();
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      const result = await dispatch(updateUserProfile(values));
      if (result.type.endsWith("/fulfilled")) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const initialValues: ProfileFormValues = {
    name: profile?.name || "",
    phoneNumber: profile?.phoneNumber || [""],
    education: profile?.education || "",
    address: profile?.address || "",
  };

  const getLeaveBalancePercentage = (remaining: number, total: number) => {
    return total > 0 ? (remaining / total) * 100 : 0;
  };

  const getLeaveBalanceColor = (remaining: number, total: number) => {
    const percentage = getLeaveBalancePercentage(remaining, total);
    if (percentage <= 20) return "error";
    if (percentage <= 50) return "warning";
    return "success";
  };

  if (isLoading || !profile) {
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
          Loading profile...
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
          background: "linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ fontWeight: "bold" }}
              >
                My Profile
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                View and manage your personal information
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            sx={{
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Profile Overview */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: "fit-content",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: { xs: 80, sm: 120 },
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: { xs: "2rem", sm: "3rem" },
                  boxShadow: theme.shadows[4],
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>

              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {profile.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word" }}
                >
                  {profile.email}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <SupervisorIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Chip
                  label={profile.supervisor}
                  color="primary"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  Since {formatDate(profile.createdAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ fontWeight: "bold" }}
                >
                  Profile Information
                </Typography>
                {!isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      alignSelf: { xs: "stretch", sm: "auto" },
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {!isEditing ? (
                // View Mode
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Full Name
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {profile.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <EmailIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Email Address
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "medium", wordBreak: "break-word" }}
                      >
                        {profile.email}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Phone Numbers
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {formatPhoneNumbers(profile.phoneNumber)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <SupervisorIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Supervisor
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {profile.supervisor}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <SchoolIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Education
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {profile.education || "Not provided"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <HomeIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          Address
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {profile.address || "Not provided"}
                      </Typography>
                    </Box>
                  </Grid>

                  {profile.updatedAt && (
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        Last updated: {formatDate(profile.updatedAt)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              ) : (
                // Edit Mode
                <Formik
                  initialValues={initialValues}
                  validationSchema={profileUpdateValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ errors, touched, values, handleChange, handleBlur }) => (
                    <Form>
                      <Grid container spacing={{ xs: 2, sm: 3 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            as={TextField}
                            name="name"
                            label="Full Name"
                            fullWidth
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Email Address"
                            fullWidth
                            value={profile.email}
                            disabled
                            helperText="Email cannot be changed"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>

                        {/* Phone Numbers */}
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                          >
                            Phone Numbers
                          </Typography>
                          <FieldArray name="phoneNumber">
                            {({ push, remove }) => (
                              <Stack spacing={2}>
                                {values.phoneNumber.map((phone, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "flex",
                                      flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                      },
                                      gap: 1,
                                    }}
                                  >
                                    <TextField
                                      name={`phoneNumber.${index}`}
                                      label={`Phone ${index + 1}`}
                                      fullWidth
                                      value={phone}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched.phoneNumber &&
                                        Array.isArray(touched.phoneNumber) &&
                                        touched.phoneNumber[index] &&
                                        Boolean(errors.phoneNumber?.[index])
                                      }
                                      helperText={
                                        touched.phoneNumber &&
                                        Array.isArray(touched.phoneNumber) &&
                                        touched.phoneNumber[index] &&
                                        errors.phoneNumber?.[index]
                                      }
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 2,
                                        },
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {values.phoneNumber.length > 1 && (
                                        <IconButton
                                          onClick={() => remove(index)}
                                          color="error"
                                          sx={{
                                            bgcolor: "error.50",
                                            "&:hover": { bgcolor: "error.100" },
                                          }}
                                        >
                                          <RemoveIcon />
                                        </IconButton>
                                      )}
                                      {index ===
                                        values.phoneNumber.length - 1 && (
                                        <IconButton
                                          onClick={() => push("")}
                                          color="primary"
                                          sx={{
                                            bgcolor: "primary.50",
                                            "&:hover": {
                                              bgcolor: "primary.100",
                                            },
                                          }}
                                        >
                                          <AddIcon />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </Box>
                                ))}
                              </Stack>
                            )}
                          </FieldArray>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Field
                            as={TextField}
                            name="education"
                            label="Education"
                            fullWidth
                            multiline
                            rows={isMobile ? 3 : 4}
                            value={values.education}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.education && Boolean(errors.education)
                            }
                            helperText={touched.education && errors.education}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Field
                            as={TextField}
                            name="address"
                            label="Address"
                            fullWidth
                            multiline
                            rows={isMobile ? 3 : 4}
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Supervisor"
                            fullWidth
                            value={profile.supervisor}
                            disabled
                            helperText="Supervisor assignment cannot be changed"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 2,
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={isLoading}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            py: { xs: 1.5, sm: 1 },
                            order: { xs: 1, sm: 1 },
                          }}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setIsEditing(false)}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            py: { xs: 1.5, sm: 1 },
                            order: { xs: 2, sm: 2 },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Information */}
      {profile.leave && (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  gutterBottom
                  sx={{ fontWeight: "bold", mb: 3 }}
                >
                  Leave Balance
                </Typography>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                      sx={{
                        bgcolor: "success.50",
                        border: "1px solid",
                        borderColor: "success.200",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent
                        sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}
                      >
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          color="success.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          {profile.leave.annualLeave?.remaining || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Annual Leave Remaining
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          out of {profile.leave.annualLeave?.total || 0} days
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getLeaveBalancePercentage(
                            profile.leave.annualLeave?.remaining || 0,
                            profile.leave.annualLeave?.total || 0
                          )}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              bgcolor: "success.main",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                      sx={{
                        bgcolor: "error.50",
                        border: "1px solid",
                        borderColor: "error.200",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent
                        sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}
                      >
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          color="error.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          {profile.leave.sickLeave?.remaining || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Sick Leave Remaining
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          out of {profile.leave.sickLeave?.total || 0} days
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getLeaveBalancePercentage(
                            profile.leave.sickLeave?.remaining || 0,
                            profile.leave.sickLeave?.total || 0
                          )}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              bgcolor: "error.main",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                      sx={{
                        bgcolor: "warning.50",
                        border: "1px solid",
                        borderColor: "warning.200",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent
                        sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}
                      >
                        <Typography
                          variant={isMobile ? "h5" : "h4"}
                          color="warning.main"
                          sx={{ fontWeight: "bold" }}
                        >
                          {profile.leave.casualLeave?.remaining || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Casual Leave Remaining
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          out of {profile.leave.casualLeave?.total || 0} days
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getLeaveBalancePercentage(
                            profile.leave.casualLeave?.remaining || 0,
                            profile.leave.casualLeave?.total || 0
                          )}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              bgcolor: "warning.main",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {profile.leave.currentLeave?.startDate && (
                  <Card
                    sx={{
                      mt: 3,
                      bgcolor: "info.50",
                      border: "1px solid",
                      borderColor: "info.200",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Current Leave Status
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Currently on {profile.leave.currentLeave.type} from{" "}
                        {formatDate(profile.leave.currentLeave.startDate)} to{" "}
                        {formatDate(profile.leave.currentLeave.endDate || "")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {profile.leave.currentLeave.days} days
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
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
            alignItems: "center",
            bgcolor: "error.main",
            color: "white",
            p: { xs: 2, sm: 3 },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ fontWeight: "bold" }}
          >
            Confirm Logout
          </Typography>
          {isMobile && (
            <IconButton
              onClick={handleLogoutCancel}
              sx={{ color: "white", ml: "auto" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ pt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },

            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            onClick={handleLogoutCancel}
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: 2,
              order: { xs: 2, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            autoFocus
            sx={{
              borderRadius: 2,
              order: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
