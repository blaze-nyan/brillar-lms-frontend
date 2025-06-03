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
  Button,
  IconButton,
  Tooltip,
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
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchUsers, deleteUser, clearError, clearSuccessMessage } from "@/lib/features/admin/adminSlice"
import type { User } from "@/lib/types"

interface UsersManagementTableProps {
  onViewUser: (user: User) => void
  onEditUser: (user: User) => void
}

const supervisors = ["All", "Ko Kaung San Phoe", "Ko Kyaw Swa Win", "Dimple", "Budiman"]

export function UsersManagementTable({ onViewUser, onEditUser }: UsersManagementTableProps) {
  const dispatch = useAppDispatch()
  const { users, usersPagination, isLoading, isSubmitting, error, successMessage } = useAppSelector(
    (state) => state.admin,
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [supervisor, setSupervisor] = useState("All")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [page, pageSize, supervisor])

  useEffect(() => {
    if (successMessage) {
      setSnackbarOpen(true)
    }
  }, [successMessage])

  const loadUsers = () => {
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

    dispatch(fetchUsers(params))
  }

  const handleSearch = () => {
    setPage(0)
    loadUsers()
  }

  const handleSupervisorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSupervisor(event.target.value)
    setPage(0)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id)).unwrap()
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      } catch (error) {
        // Error handled by Redux
      }
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
    dispatch(clearSuccessMessage())
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "supervisor", headerName: "Supervisor", flex: 1, minWidth: 150 },
    {
      field: "joinDate",
      headerName: "Join Date",
      flex: 1,
      minWidth: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.joinDate
          ? new Date(params.row.joinDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value as string
        let color = ""
        let backgroundColor = ""

        switch (status) {
          case "active":
            color = "green"
            backgroundColor = "#e6f7e6"
            break
          case "inactive":
            color = "red"
            backgroundColor = "#ffebee"
            break
          case "on_leave":
            color = "orange"
            backgroundColor = "#fff8e1"
            break
          default:
            color = "gray"
            backgroundColor = "#f5f5f5"
        }

        return (
          <Box
            sx={{
              backgroundColor,
              color,
              borderRadius: "16px",
              padding: "4px 12px",
              textTransform: "capitalize",
              fontWeight: "medium",
              fontSize: "0.75rem",
              display: "inline-block",
            }}
          >
            {status?.replace("_", " ") || "Unknown"}
          </Box>
        )
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
          <Tooltip title="View">
            <IconButton size="small" onClick={() => onViewUser(params.row)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEditUser(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)} color="error">
              <DeleteIcon fontSize="small" />
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
          Users Management
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} sx={{ bgcolor: "primary.main" }}>
          Add User
        </Button>
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
          rows={users}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={usersPagination.total}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
