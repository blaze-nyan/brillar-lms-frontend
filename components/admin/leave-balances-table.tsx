"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  DataGrid,
  type GridColDef,
  type GridValueGetterParams,
  type GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid"
import { Search as SearchIcon, Refresh as RefreshIcon, Edit as EditIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchAllLeaveBalances,
  resetLeaveBalance,
  clearError,
  clearSuccessMessage,
} from "@/lib/features/admin/adminSlice"
import type { UserLeaveBalance, LeaveBalanceAdjustment } from "@/lib/types"
import { LeaveBalanceAdjustmentDialog } from "./leave-balance-adjustment-dialog"

const supervisors = ["All", "Ko Kaung San Phoe", "Ko Kyaw Swa Win", "Dimple", "Budiman"]

export function LeaveBalancesTable() {
  const dispatch = useAppDispatch()
  const { userLeaveBalances, leaveBalancesPagination, isLoading, isSubmitting, error, successMessage } = useAppSelector(
    (state) => state.admin,
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [supervisor, setSupervisor] = useState("All")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [userToReset, setUserToReset] = useState<UserLeaveBalance | null>(null)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [userToAdjust, setUserToAdjust] = useState<UserLeaveBalance | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    loadLeaveBalances()
  }, [page, pageSize, supervisor])

  useEffect(() => {
    if (successMessage) {
      setSnackbarOpen(true)
    }
  }, [successMessage])

  const loadLeaveBalances = () => {
    const params: any = {
      page: page + 1,
      limit: pageSize,
    }

    if (supervisor !== "All") {
      params.supervisor = supervisor
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    dispatch(fetchAllLeaveBalances(params))
  }

  const handleSearch = () => {
    setPage(0)
    loadLeaveBalances()
  }

  const handleSupervisorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSupervisor(event.target.value)
    setPage(0)
  }

  const handleResetClick = (userBalance: UserLeaveBalance) => {
    setUserToReset(userBalance)
    setResetDialogOpen(true)
  }

  const handleResetConfirm = async () => {
    if (userToReset) {
      try {
        await dispatch(resetLeaveBalance(userToReset.userId)).unwrap()
        setResetDialogOpen(false)
        setUserToReset(null)
      } catch (error) {
        // Error handled by Redux
      }
    }
  }

  const handleAdjustClick = (userBalance: UserLeaveBalance) => {
    setUserToAdjust(userBalance)
    setAdjustDialogOpen(true)
  }

  const handleAdjustSubmit = async (adjustment: LeaveBalanceAdjustment) => {
    setAdjustDialogOpen(false)
    // The actual adjustment is handled in the dialog component
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
    dispatch(clearSuccessMessage())
  }

  const columns: GridColDef[] = [
    { field: "userName", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "userEmail", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "supervisor", headerName: "Supervisor", flex: 1, minWidth: 150 },
    {
      field: "annualLeaveRemaining",
      headerName: "Annual Leave",
      flex: 1,
      minWidth: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return `${params.row.balance.annualLeave.remaining}/${params.row.balance.annualLeave.total}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const [remaining, total] = (params.value as string).split("/").map(Number)
        const color = remaining === 0 ? "error" : remaining < total / 3 ? "warning" : "success"

        return <Box sx={{ color: `${color}.main`, fontWeight: "medium" }}>{params.value}</Box>
      },
    },
    {
      field: "sickLeaveRemaining",
      headerName: "Sick Leave",
      flex: 1,
      minWidth: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return `${params.row.balance.sickLeave.remaining}/${params.row.balance.sickLeave.total}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const [remaining, total] = (params.value as string).split("/").map(Number)
        const color = remaining === 0 ? "error" : remaining < total / 3 ? "warning" : "success"

        return <Box sx={{ color: `${color}.main`, fontWeight: "medium" }}>{params.value}</Box>
      },
    },
    {
      field: "casualLeaveRemaining",
      headerName: "Casual Leave",
      flex: 1,
      minWidth: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return `${params.row.balance.casualLeave.remaining}/${params.row.balance.casualLeave.total}`
      },
      renderCell: (params: GridRenderCellParams) => {
        const [remaining, total] = (params.value as string).split("/").map(Number)
        const color = remaining === 0 ? "error" : remaining < total / 3 ? "warning" : "success"

        return <Box sx={{ color: `${color}.main`, fontWeight: "medium" }}>{params.value}</Box>
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Adjust Balance">
            <IconButton size="small" onClick={() => handleAdjustClick(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Balance">
            <IconButton size="small" onClick={() => handleResetClick(params.row)} color="warning">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
          Leave Balances Management
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: "200px" }}
        />
        <TextField
          select
          label="Supervisor"
          variant="outlined"
          size="small"
          value={supervisor}
          onChange={handleSupervisorChange}
          sx={{ minWidth: "200px" }}
        >
          {supervisors.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={userLeaveBalances.map((item) => ({ ...item, id: item.userId }))}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={leaveBalancesPagination.total}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page)
            setPageSize(model.pageSize)
          }}
          disableRowSelectionOnClick
          loading={isLoading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Are you sure you want to reset leave balance for {userToReset?.userName}? This will restore all leave
            balances to their default values.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleResetConfirm}
            color="warning"
            autoFocus
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Balance Adjustment Dialog */}
      {userToAdjust && (
        <LeaveBalanceAdjustmentDialog
          open={adjustDialogOpen}
          onClose={() => setAdjustDialogOpen(false)}
          onSubmit={handleAdjustSubmit}
          user={userToAdjust}
        />
      )}

      {/* Success Snackbar */}
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
    </Paper>
  )
}
