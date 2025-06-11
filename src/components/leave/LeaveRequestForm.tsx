"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  CalendarToday as CalendarIcon,
  TimeToLeave as LeaveIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { useApi } from "@/hooks/useApi";
import { leaveApi } from "@/store/api/leaveApi";
import { LEAVE_TYPES } from "@/utils/constants";
import { differenceInDays, addDays } from "date-fns";

interface LeaveRequestFormValues {
  leaveType: "annualLeave" | "sickLeave" | "casualLeave";
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

const validationSchema = Yup.object({
  leaveType: Yup.string()
    .oneOf(["annualLeave", "sickLeave", "casualLeave"], "Invalid leave type")
    .required("Leave type is required"),
  startDate: Yup.date()
    .min(new Date(), "Start date cannot be in the past")
    .required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  reason: Yup.string().max(500, "Reason must be at most 500 characters"),
});

export const LeaveRequestForm: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { leaveBalance } = useSelector((state: RootState) => state.leave) as {
    leaveBalance: any;
  };

  const {
    data: requestData,
    loading: isSubmitting,
    error: apiError,
    execute: submitLeaveRequest,
    reset: resetApi,
  } = useApi(leaveApi.requestLeave);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const initialValues: LeaveRequestFormValues = {
    leaveType: "annualLeave",
    startDate: null,
    endDate: null,
    reason: "",
  };

  const handleSubmit = async (values: LeaveRequestFormValues) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      if (!values.startDate || !values.endDate) {
        setSubmitError("Please select both start and end dates");
        return;
      }

      const days = differenceInDays(values.endDate, values.startDate) + 1;

      const currentBalance = leaveBalance?.[values.leaveType];
      if (currentBalance && currentBalance.remaining < days) {
        setSubmitError(
          `Insufficient ${LEAVE_TYPES[values.leaveType]} balance. You have ${currentBalance.remaining} days remaining.`
        );
        return;
      }

      const leaveData = {
        leaveType: values.leaveType,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        days,
        reason: values.reason || undefined,
      };

      const result = await submitLeaveRequest(leaveData);
      setSubmitSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/leave/history");
      }, 2000);
    } catch (error) {
      console.error("Leave request error:", error);
      setSubmitError("Failed to submit leave request. Please try again.");
    }
  };

  const handleFormChange = () => {
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(false);
    if (apiError) resetApi();
  };

  const getBalancePercentage = (remaining: number, total: number) => {
    return total > 0 ? (remaining / total) * 100 : 0;
  };

  const getBalanceColor = (remaining: number, total: number) => {
    const percentage = getBalancePercentage(remaining, total);
    if (percentage <= 20) return "error";
    if (percentage <= 50) return "warning";
    return "success";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                Request Leave
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Submit your leave request for approval
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Leave Balance Card */}
          {leaveBalance && (
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  mb: { xs: 2, sm: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    Your Leave Balance
                  </Typography>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {Object.entries(LEAVE_TYPES).map(([key, label]) => {
                      const balance =
                        leaveBalance[key as keyof typeof LEAVE_TYPES];
                      const remaining = balance?.remaining || 0;
                      const total = balance?.total || 0;
                      const color = getBalanceColor(remaining, total);

                      return (
                        <Grid size={{ xs: 12, sm: 4 }} key={key}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: `${color}.50`,
                              border: `1px solid`,
                              borderColor: `${color}.200`,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {label}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant={isMobile ? "h5" : "h4"}
                                sx={{
                                  fontWeight: "bold",
                                  color: `${color}.main`,
                                }}
                              >
                                {remaining}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                / {total} days
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={getBalancePercentage(remaining, total)}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "white",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 3,
                                  bgcolor: `${color}.main`,
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Leave Request Form */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Error Messages */}
                {(apiError || submitError) && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {apiError || submitError}
                  </Alert>
                )}

                {/* Success Message */}
                {submitSuccess && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Leave request submitted successfully! Redirecting to leave
                    history...
                  </Alert>
                )}

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    errors,
                    touched,
                    values,
                    setFieldValue,
                    handleChange,
                    handleBlur,
                  }) => (
                    <Form onChange={handleFormChange}>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        gutterBottom
                        sx={{ fontWeight: "bold", mb: 3 }}
                      >
                        Leave Request Details
                      </Typography>

                      {/* Leave Type Selection */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Leave Type</InputLabel>
                        <Field
                          as={Select}
                          name="leaveType"
                          label="Leave Type"
                          value={values.leaveType}
                          onChange={handleChange}
                          error={touched.leaveType && Boolean(errors.leaveType)}
                          sx={{
                            borderRadius: 2,
                          }}
                        >
                          {Object.entries(LEAVE_TYPES).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                              {label}
                            </MenuItem>
                          ))}
                        </Field>
                        {touched.leaveType && errors.leaveType && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ ml: 2, mt: 0.5 }}
                          >
                            {errors.leaveType}
                          </Typography>
                        )}
                      </FormControl>

                      {/* Date Selection */}
                      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <DatePicker
                            label="Start Date"
                            value={values.startDate}
                            onChange={(newValue) => {
                              setFieldValue("startDate", newValue);
                              if (newValue && !values.endDate) {
                                setFieldValue("endDate", newValue);
                              }
                              handleFormChange();
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error:
                                  touched.startDate &&
                                  Boolean(errors.startDate),
                                helperText:
                                  touched.startDate && errors.startDate,
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                },
                              },
                            }}
                            minDate={new Date()}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <DatePicker
                            label="End Date"
                            value={values.endDate}
                            onChange={(newValue) => {
                              setFieldValue("endDate", newValue);
                              handleFormChange();
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error:
                                  touched.endDate && Boolean(errors.endDate),
                                helperText: touched.endDate && errors.endDate,
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                },
                              },
                            }}
                            minDate={values.startDate || new Date()}
                          />
                        </Grid>
                      </Grid>

                      {/* Days Calculation */}
                      {values.startDate && values.endDate && (
                        <Card
                          sx={{
                            mb: 3,
                            bgcolor: "info.50",
                            border: "1px solid",
                            borderColor: "info.200",
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <InfoIcon
                                sx={{ color: "info.main", fontSize: 20 }}
                              />
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                              >
                                Request Summary
                              </Typography>
                            </Box>
                            <Stack spacing={1}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="body2">
                                  Total days requested:
                                </Typography>
                                <Chip
                                  label={`${differenceInDays(values.endDate, values.startDate) + 1} days`}
                                  color="info"
                                  size="small"
                                  sx={{ fontWeight: "bold" }}
                                />
                              </Box>
                              {leaveBalance && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Remaining after request:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "bold",
                                      color: "text.primary",
                                    }}
                                  >
                                    {(leaveBalance[values.leaveType]
                                      ?.remaining || 0) -
                                      (differenceInDays(
                                        values.endDate,
                                        values.startDate
                                      ) +
                                        1)}{" "}
                                    days
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      )}

                      {/* Reason Field */}
                      <Field
                        as={TextField}
                        name="reason"
                        label="Reason (Optional)"
                        fullWidth
                        multiline
                        rows={isMobile ? 3 : 4}
                        value={values.reason}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          handleFormChange();
                        }}
                        onBlur={handleBlur}
                        error={touched.reason && Boolean(errors.reason)}
                        helperText={touched.reason && errors.reason}
                        placeholder="Please provide a reason for your leave request..."
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <Divider sx={{ my: 3 }} />

                      {/* Action Buttons */}
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
                          disabled={isSubmitting || submitSuccess}
                          startIcon={<SendIcon />}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            py: { xs: 1.5, sm: 1 },
                            order: { xs: 1, sm: 2 },
                          }}
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : submitSuccess
                              ? "Request Submitted!"
                              : "Submit Request"}
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => router.back()}
                          disabled={isSubmitting}
                          startIcon={<ArrowBackIcon />}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            py: { xs: 1.5, sm: 1 },
                            order: { xs: 2, sm: 1 },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>

                {/* Show request result */}
                {requestData && (
                  <Card
                    sx={{
                      mt: 3,
                      bgcolor: "success.50",
                      border: "1px solid",
                      borderColor: "success.200",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        gutterBottom
                      >
                        Request Submitted Successfully!
                      </Typography>
                      <Typography variant="body2">
                        Your{" "}
                        {(LEAVE_TYPES as any)[(requestData.data as any)?.leaveRequest?.leaveType]}{" "}
                        request for {(requestData.data as any)?.leaveRequest?.days} days
                        has been submitted.
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};
