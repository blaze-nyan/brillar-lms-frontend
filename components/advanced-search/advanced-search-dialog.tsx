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
  Grid,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

interface SearchFilters {
  name?: string
  email?: string
  supervisor?: string
  status?: string[]
  joinDateFrom?: Date | null
  joinDateTo?: Date | null
  leaveType?: string[]
  leaveStatus?: string[]
}

interface AdvancedSearchDialogProps {
  open: boolean
  onClose: () => void
  onApply: (filters: SearchFilters) => void
  onClear: () => void
  initialFilters?: SearchFilters
  type: "users" | "leaves"
}

const supervisors = ["Ko Kaung San Phoe", "Ko Kyaw Swa Win", "Dimple", "Budiman"]
const userStatuses = ["active", "inactive", "on_leave"]
const leaveTypes = ["annualLeave", "sickLeave", "casualLeave"]
const leaveStatuses = ["pending", "approved", "rejected"]

export function AdvancedSearchDialog({
  open,
  onClose,
  onApply,
  onClear,
  initialFilters = {},
  type,
}: AdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const handleChange = (field: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectChange = (field: keyof SearchFilters) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setFilters((prev) => ({ ...prev, [field]: typeof value === "string" ? value.split(",") : value }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    setFilters({})
    onClear()
    onClose()
  }

  const renderUserFilters = () => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Name"
          value={filters.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          value={filters.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Supervisor"
          value={filters.supervisor || ""}
          onChange={(e) => handleChange("supervisor", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {supervisors.map((supervisor) => (
            <MenuItem key={supervisor} value={supervisor}>
              {supervisor}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.status || []}
            onChange={handleMultiSelectChange("status")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {userStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace("_", " ").toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Join Date From"
            value={filters.joinDateFrom}
            onChange={(date) => handleChange("joinDateFrom", date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Join Date To"
            value={filters.joinDateTo}
            onChange={(date) => handleChange("joinDateTo", date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
    </>
  )

  const renderLeaveFilters = () => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Employee Name"
          value={filters.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Supervisor"
          value={filters.supervisor || ""}
          onChange={(e) => handleChange("supervisor", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {supervisors.map((supervisor) => (
            <MenuItem key={supervisor} value={supervisor}>
              {supervisor}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Leave Type</InputLabel>
          <Select
            multiple
            value={filters.leaveType || []}
            onChange={handleMultiSelectChange("leaveType")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Leave Status</InputLabel>
          <Select
            multiple
            value={filters.leaveStatus || []}
            onChange={handleMultiSelectChange("leaveStatus")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {leaveStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date From"
            value={filters.joinDateFrom}
            onChange={(date) => handleChange("joinDateFrom", date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date To"
            value={filters.joinDateTo}
            onChange={(date) => handleChange("joinDateTo", date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
    </>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Advanced Search</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {type === "users" ? renderUserFilters() : renderLeaveFilters()}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="secondary">
          Clear All
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  )
}
