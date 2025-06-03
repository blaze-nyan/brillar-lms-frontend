"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { submitLeaveRequest, clearError, clearSuccessMessage } from "@/lib/features/leave/leaveSlice"
import type { LeaveType } from "@/lib/types"

const leaveTypes = [
  { value: "annualLeave", label: "Annual Leave" },
  { value: "sickLeave", label: "Sick Leave" },
  { value: "casualLeave", label: "Casual Leave" },
]

const validationSchema = Yup.object({
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.date().required("Start date is required").min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date().required("End date is required").min(Yup.ref("startDate"), "End date must be after start date"),
  reason: Yup.string().required("Reason is required").min(10, "Reason must be at least 10 characters"),
})

// Helper function to calculate business days
const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

export function LeaveRequestForm() {
  const dispatch = useAppDispatch()
  const { balance, isSubmitting, error, successMessage } = useAppSelector((state) => state.leave)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const days = calculateBusinessDays(values.startDate, values.endDate)

    // Check if user has sufficient balance
    const leaveBalance = balance?.[values.leaveType as LeaveType]
    if (leaveBalance && days > leaveBalance.remaining) {
      dispatch(clearError())
      return
    }

    try {
      await dispatch(
        submitLeaveRequest({
          leaveType: values.leaveType,
          startDate: values.startDate.toISOString().split("T")[0],
          endDate: values.endDate.toISOString().split("T")[0],
          days,
          reason: values.reason,
        }),
      ).unwrap()

      resetForm()
      setSnackbarOpen(true)
    } catch (error) {
      // Error handled by Redux
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
    dispatch(clearSuccessMessage())
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Request Leave
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              leaveType: "",
              startDate: null,
              endDate: null,
              reason: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => {
              const days =
                values.startDate && values.endDate ? calculateBusinessDays(values.startDate, values.endDate) : 0

              const selectedLeaveBalance = balance?.[values.leaveType as LeaveType]
              const hasInsufficientBalance = selectedLeaveBalance && days > selectedLeaveBalance.remaining

              return (
                <Form className="space-y-4">
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    name="leaveType"
                    label="Leave Type"
                    value={values.leaveType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.leaveType && Boolean(errors.leaveType)}
                    helperText={touched.leaveType && errors.leaveType}
                  >
                    {leaveTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>

                  {values.leaveType && selectedLeaveBalance && (
                    <Alert severity="info" className="mb-4">
                      Available {leaveTypes.find((t) => t.value === values.leaveType)?.label}:{" "}
                      {selectedLeaveBalance.remaining} days
                    </Alert>
                  )}

                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      value={values.startDate}
                      onChange={(date) => setFieldValue("startDate", date)}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.startDate && Boolean(errors.startDate),
                          helperText: touched.startDate && errors.startDate,
                        },
                      }}
                    />

                    <DatePicker
                      label="End Date"
                      value={values.endDate}
                      onChange={(date) => setFieldValue("endDate", date)}
                      minDate={values.startDate || new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.endDate && Boolean(errors.endDate),
                          helperText: touched.endDate && errors.endDate,
                        },
                      }}
                    />
                  </Box>

                  {days > 0 && (
                    <Alert severity={hasInsufficientBalance ? "error" : "info"} className="mb-4">
                      {hasInsufficientBalance
                        ? `Insufficient balance! You need ${days} days but only have ${selectedLeaveBalance?.remaining} days available.`
                        : `Total business days: ${days}`}
                    </Alert>
                  )}

                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={4}
                    name="reason"
                    label="Reason for Leave"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reason && Boolean(errors.reason)}
                    helperText={touched.reason && errors.reason}
                    placeholder="Please provide a detailed reason for your leave request..."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || hasInsufficientBalance || days === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Leave Request"}
                  </Button>
                </Form>
              )
            }}
          </Formik>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
              {successMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}
