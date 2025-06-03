"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { adjustLeaveBalance } from "@/lib/features/admin/adminSlice"
import type { UserLeaveBalance, LeaveBalanceAdjustment } from "@/lib/types"

interface LeaveBalanceAdjustmentDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (adjustment: LeaveBalanceAdjustment) => void
  user: UserLeaveBalance
}

export function LeaveBalanceAdjustmentDialog({ open, onClose, onSubmit, user }: LeaveBalanceAdjustmentDialogProps) {
  const dispatch = useAppDispatch()
  const { isSubmitting, error } = useAppSelector((state) => state.admin)

  const [adjustment, setAdjustment] = useState<LeaveBalanceAdjustment>({
    annualLeave: 0,
    sickLeave: 0,
    casualLeave: 0,
  })

  const handleChange = (field: keyof LeaveBalanceAdjustment, value: string) => {
    const numValue = value === "" ? undefined : Number(value)
    setAdjustment((prev) => ({ ...prev, [field]: numValue }))
  }

  const handleSubmit = async () => {
    try {
      await dispatch(adjustLeaveBalance({ userId: user.userId, adjustment })).unwrap()
      onSubmit(adjustment)
      onClose()
    } catch (error) {
      // Error handled by Redux
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adjust Leave Balance</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {user.userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.userEmail}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Annual Leave (Current: {user.balance.annualLeave.remaining}/{user.balance.annualLeave.total})
            </Typography>
            <TextField
              label="Adjustment"
              type="number"
              fullWidth
              size="small"
              value={adjustment.annualLeave === undefined ? "" : adjustment.annualLeave}
              onChange={(e) => handleChange("annualLeave", e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Enter positive value to add days, negative to subtract"
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Sick Leave (Current: {user.balance.sickLeave.remaining}/{user.balance.sickLeave.total})
            </Typography>
            <TextField
              label="Adjustment"
              type="number"
              fullWidth
              size="small"
              value={adjustment.sickLeave === undefined ? "" : adjustment.sickLeave}
              onChange={(e) => handleChange("sickLeave", e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Enter positive value to add days, negative to subtract"
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Casual Leave (Current: {user.balance.casualLeave.remaining}/{user.balance.casualLeave.total})
            </Typography>
            <TextField
              label="Adjustment"
              type="number"
              fullWidth
              size="small"
              value={adjustment.casualLeave === undefined ? "" : adjustment.casualLeave}
              onChange={(e) => handleChange("casualLeave", e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Enter positive value to add days, negative to subtract"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isSubmitting ||
            ((adjustment.annualLeave === 0 || adjustment.annualLeave === undefined) &&
              (adjustment.sickLeave === 0 || adjustment.sickLeave === undefined) &&
              (adjustment.casualLeave === 0 || adjustment.casualLeave === undefined))
          }
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          Apply Adjustment
        </Button>
      </DialogActions>
    </Dialog>
  )
}
